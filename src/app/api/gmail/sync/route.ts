import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseOrderEmail } from '@/lib/parsers';
import { SAMPLE_EMAILS } from '@/lib/gmail/sampleEmails';
import { isOrderDuplicate, determineOrderAction } from '@/lib/gmail/deduplicator';
import { Order, EmailLog } from '@/types';

export async function GET() {
  const state = db.getGmailState();
  const logs = db.getEmailLogs().slice(0, 50);
  return NextResponse.json({ success: true, state, recentLogs: logs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sampleIndex, customEmail } = body;

    const existingOrders = db.getOrders();
    const emailsToProcess = customEmail 
      ? [customEmail] 
      : (typeof sampleIndex === 'number' && SAMPLE_EMAILS[sampleIndex] 
          ? [SAMPLE_EMAILS[sampleIndex]] 
          : [SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)]]);

    let createdCount = 0;
    let updatedCount = 0;
    let duplicateCount = 0;
    const processedLogs: EmailLog[] = [];

    for (const email of emailsToProcess) {
      const parseResult = parseOrderEmail({
        subject: email.subject || '',
        from: email.from || '',
        body: email.body || '',
      });

      const extracted = parseResult.data;
      const marketplace = parseResult.marketplace;
      const marketplaceOrderId = extracted.marketplaceOrderId || `EXT-${Date.now()}`;

      const { isDuplicate, existingOrder } = isOrderDuplicate(existingOrders, marketplace, marketplaceOrderId);
      const action = determineOrderAction(existingOrder, parseResult.emailType);

      let processedOrderId: string | undefined = existingOrder?.id;
      let logStatus = parseResult.missingFields.length > 0 ? 'PARTIAL' : 'SUCCESS';

      if (action === 'IGNORE_DUPLICATE') {
        duplicateCount++;
        logStatus = 'DUPLICATE_SKIPPED';
      } else if (action === 'UPDATE_STATUS' && existingOrder) {
        updatedCount++;
        let newStatus = existingOrder.internalStatus;
        if (parseResult.emailType === 'CANCELLATION') newStatus = 'CANCELLED';
        if (parseResult.emailType === 'RETURN_REQUEST') newStatus = 'RETURNED';
        if (parseResult.emailType === 'REFUND_NOTIFICATION') newStatus = 'REFUNDED';
        if (parseResult.emailType === 'SHIPMENT_UPDATE') newStatus = 'SHIPPED';

        db.updateOrder(existingOrder.id, {
          internalStatus: newStatus,
          shippingStatus: parseResult.emailType === 'SHIPMENT_UPDATE' ? 'IN_TRANSIT' : existingOrder.shippingStatus,
        }, 'Gmail Email Processor');

        // If cancelled or returned, release reserved inventory
        if (newStatus === 'CANCELLED' || newStatus === 'RETURNED') {
          for (const item of existingOrder.items) {
            db.adjustStock(item.sku, item.quantity, `Stock released from ${newStatus} order ${existingOrder.orderNumber}`);
          }
        }
      } else {
        // CREATE_NEW order
        createdCount++;
        const newOrderId = `ord-${Date.now()}-${Math.floor(Math.random() * 100)}`;
        processedOrderId = newOrderId;

        const newOrder: Order = {
          id: newOrderId,
          tenantId: 'company-apex-retail',
          orderNumber: `OMS-${1000 + existingOrders.length + createdCount}`,
          marketplaceOrderId,
          marketplace,
          orderDate: extracted.orderDate || new Date().toISOString(),
          internalStatus: extracted.internalStatus || 'CONFIRMED',
          marketplaceStatus: extracted.marketplaceStatus || 'Ingested from Gmail',
          customer: extracted.customer || { name: 'Customer' },
          shippingAddress: extracted.shippingAddress || {
            street: 'Extracted Delivery Address',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
          },
          items: extracted.items || [{
            id: `item-${Date.now()}`,
            sku: 'SKU-EXTRACTED',
            name: 'Parsed Order Item',
            quantity: 1,
            unitPrice: extracted.totalAmount || 999,
            totalPrice: extracted.totalAmount || 999,
          }],
          currency: extracted.currency || 'INR',
          subtotal: extracted.subtotal || extracted.totalAmount || 999,
          tax: extracted.tax || 0,
          shippingCost: extracted.shippingCost || 0,
          discount: extracted.discount || 0,
          totalAmount: extracted.totalAmount || 999,
          paymentStatus: extracted.paymentStatus || 'PAID',
          paymentMethod: extracted.paymentMethod || 'Prepaid',
          shippingStatus: extracted.shippingStatus || 'UNFULFILLED',
          courierPartner: extracted.courierPartner,
          rawEmailSubject: email.subject,
          rawEmailSnippet: email.body.slice(0, 200) + '...',
          timeline: [
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toISOString(),
              title: 'Order Ingested from Gmail',
              description: `Matched rule: ${parseResult.matchedRule} (Confidence: ${parseResult.confidenceScore}%)`,
              source: 'GMAIL_EMAIL',
            }
          ],
          notes: [],
          isManualCorrection: false,
          unknownFields: parseResult.missingFields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        db.createOrder(newOrder);

        // Reserve inventory for the new order
        for (const item of newOrder.items) {
          db.adjustStock(item.sku, -item.quantity, `Reserved for new order ${newOrder.orderNumber}`);
        }
      }

      // Record Email Log
      const logEntry: EmailLog = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        tenantId: 'company-apex-retail',
        messageId: `msg-${Date.now()}`,
        subject: email.subject || 'Incoming Order Notification',
        from: email.from || 'order-service@marketplace.com',
        date: new Date().toISOString(),
        marketplaceDetected: marketplace,
        emailType: parseResult.emailType,
        status: logStatus as any,
        matchedRules: [parseResult.matchedRule],
        extractedData: extracted,
        missingFields: parseResult.missingFields,
        confidenceScore: parseResult.confidenceScore,
        processedOrderId,
        isRead: false,
        rawSnippet: email.body.slice(0, 180) + '...',
      };

      db.addEmailLog(logEntry);
      processedLogs.push(logEntry);
    }

    // Update Gmail connection stats
    const updatedGmail = db.updateGmailState({
      lastSyncAt: new Date().toISOString(),
      totalEmailsScanned: db.getGmailState().totalEmailsScanned + emailsToProcess.length,
      totalOrdersIngested: db.getGmailState().totalOrdersIngested + createdCount,
      unreadSyncPending: 0,
    });

    return NextResponse.json({
      success: true,
      summary: {
        emailsProcessed: emailsToProcess.length,
        ordersCreated: createdCount,
        ordersUpdated: updatedCount,
        duplicatesPrevented: duplicateCount,
      },
      gmailState: updatedGmail,
      logs: processedLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
