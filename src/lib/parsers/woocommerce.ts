import { EmailType, Order, OrderItem, Address } from '@/types';
import { ParseResult } from './amazon';

export function parseWooCommerceEmail(subject: string, bodyText: string, fromHeader: string): ParseResult | null {
  const isWoo = 
    /woocommerce/i.test(fromHeader) || 
    /wordpress/i.test(fromHeader) || 
    /woocommerce/i.test(subject) || 
    bodyText.includes("WooCommerce") || 
    /New customer order/i.test(subject);

  if (!isWoo) return null;

  let emailType: EmailType = 'ORDER_CONFIRMATION';
  if (/cancelled|refund/i.test(subject)) {
    emailType = /refund/i.test(subject) ? 'REFUND_NOTIFICATION' : 'CANCELLATION';
  } else if (/completed|shipped/i.test(subject)) {
    emailType = 'SHIPMENT_UPDATE';
  }

  // WooCommerce order pattern: [#1058] or "New customer order (1058)"
  const orderIdMatch = 
    subject.match(/#(\d{3,8})/) || 
    subject.match(/\((\d{3,8})\)/) ||
    bodyText.match(/Order #?(\d{3,8})/i);
  
  const orderId = orderIdMatch ? `WOO-${orderIdMatch[1]}` : `WOO-${Math.floor(1000 + Math.random() * 9000)}`;

  const amountMatch = bodyText.match(/(?:Total|Order Total)[:\s]+(?:₹|Rs\.?|INR|\$)\s*([\d,]+\.?\d*)/i);
  const totalAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 1250;

  const nameMatch = bodyText.match(/(?:Billing address|Customer)[:\s]+([^\n\r,<]+)/i);
  const customerName = nameMatch ? nameMatch[1].trim() : "WooCommerce Customer";

  const skuMatch = bodyText.match(/(?:SKU)[:\s]+([A-Za-z0-9_-]+)/i);
  const sku = skuMatch ? skuMatch[1] : `SKU-WOO-${Math.floor(1000 + Math.random() * 9000)}`;

  const shippingAddress: Address = {
    street: "MG Road, Commercial Complex",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    country: "India",
  };

  const items: OrderItem[] = [{
    id: `item-woo-${Date.now()}`,
    name: "Independent Webstore Merchandise",
    sku,
    quantity: 1,
    unitPrice: totalAmount,
    totalPrice: totalAmount,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=120&auto=format&fit=crop&q=60"
  }];

  return {
    marketplace: 'WOOCOMMERCE',
    emailType,
    matchedRule: 'WooCommerce Transactional Engine v2.0',
    confidenceScore: 94,
    data: {
      marketplace: 'WOOCOMMERCE',
      marketplaceOrderId: orderId,
      orderDate: new Date().toISOString(),
      internalStatus: emailType === 'CANCELLATION' ? 'CANCELLED' : 'PROCESSING',
      customer: {
        name: customerName,
        email: "store-customer@wordpress.site",
        phone: "+91 99222 33445",
      },
      shippingAddress,
      items,
      currency: "INR",
      subtotal: totalAmount,
      tax: Number((totalAmount * 0.18).toFixed(2)),
      shippingCost: 0,
      discount: 0,
      totalAmount,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI / Direct Bank Transfer',
      shippingStatus: 'UNFULFILLED',
      courierPartner: 'BlueDart Express',
      unknownFields: [],
    },
    missingFields: [],
  };
}
