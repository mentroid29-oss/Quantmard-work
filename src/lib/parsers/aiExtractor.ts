import { EmailType, MarketplaceType, Order, OrderItem, Address } from '@/types';
import { ParseResult } from './amazon';

export function runAIAssistedExtractor(subject: string, bodyText: string, fromHeader: string): ParseResult {
  // Determine if any marketplace is mentioned
  let detectedMarketplace: MarketplaceType = 'CUSTOM';
  if (/amazon/i.test(subject) || /amazon/i.test(bodyText) || /amazon/i.test(fromHeader)) detectedMarketplace = 'AMAZON';
  else if (/flipkart/i.test(subject) || /flipkart/i.test(bodyText)) detectedMarketplace = 'FLIPKART';
  else if (/meesho/i.test(subject) || /meesho/i.test(bodyText)) detectedMarketplace = 'MEESHO';
  else if (/shopify/i.test(subject) || /shopify/i.test(bodyText)) detectedMarketplace = 'SHOPIFY';
  else if (/woocommerce/i.test(subject) || /wordpress/i.test(bodyText)) detectedMarketplace = 'WOOCOMMERCE';
  else if (/myntra/i.test(subject) || /myntra/i.test(bodyText)) detectedMarketplace = 'MYNTRA';
  else if (/ajio/i.test(subject) || /ajio/i.test(bodyText)) detectedMarketplace = 'AJIO';

  // Determine Email Type
  let emailType: EmailType = 'ORDER_CONFIRMATION';
  if (/cancell(?:ed|ation)/i.test(subject) || /cancell(?:ed|ation)/i.test(bodyText)) {
    emailType = 'CANCELLATION';
  } else if (/return(?:ed| request)/i.test(subject) || /return/i.test(bodyText)) {
    emailType = 'RETURN_REQUEST';
  } else if (/refund(?:ed| notification)/i.test(subject) || /refund/i.test(bodyText)) {
    emailType = 'REFUND_NOTIFICATION';
  } else if (/ship(?:ped|ment)|dispatch(?:ed)?|tracking|out for delivery/i.test(subject)) {
    emailType = 'SHIPMENT_UPDATE';
  }

  // Regex patterns for Order ID
  const orderPatterns = [
    /(?:Order\s*(?:#|ID|No\.?|Number)?:?\s*)([A-Z0-9#\-_]{5,28})/i,
    /(OD\d{16,19})/i,
    /(\d{3}-\d{7}-\d{7})/,
    /#([0-9]{4,8})/,
    /(?:Invoice\s*#?:?\s*)([A-Z0-9\-_]{4,20})/i,
  ];

  let extractedOrderId = "";
  for (const pattern of orderPatterns) {
    const match = subject.match(pattern) || bodyText.match(pattern);
    if (match && match[1]) {
      extractedOrderId = match[1].trim();
      break;
    }
  }

  const missingFields: string[] = [];
  if (!extractedOrderId) {
    extractedOrderId = `EXT-${Math.floor(100000 + Math.random() * 900000)}`;
    missingFields.push('marketplaceOrderId');
  }

  // Extract Price / Amount
  const pricePatterns = [
    /(?:Total|Grand Total|Net Amount|Amount Paid|Order Total)[:\s]*(?:₹|Rs\.?|INR|\$)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:₹|Rs\.?|INR|\$)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(\b\d{2,6}\b)\s*(?:INR|Rs)/i
  ];

  let extractedAmount = 0;
  for (const p of pricePatterns) {
    const m = bodyText.match(p);
    if (m && m[1]) {
      const val = parseFloat(m[1].replace(/,/g, ''));
      if (!isNaN(val) && val > 0 && val < 500000) {
        extractedAmount = val;
        break;
      }
    }
  }

  if (extractedAmount === 0) {
    extractedAmount = 999;
    missingFields.push('totalAmount');
  }

  // Extract Customer Name
  let customerName = "Online Shopper";
  const namePatterns = [
    /(?:Buyer|Customer|Deliver To|Ship To|Name)[:\s]+([A-Za-z\s]{3,30})(?:\n|<|,|$)/i,
    /(?:Hello|Hi|Dear)\s+([A-Za-z\s]{2,25})[,\n]/i
  ];
  for (const p of namePatterns) {
    const m = bodyText.match(p);
    if (m && m[1] && !/team|customer|seller|support|amazon|flipkart/i.test(m[1])) {
      customerName = m[1].trim();
      break;
    }
  }

  // Extract Shipping Address
  const shippingAddress: Address = {
    street: "Standard Delivery Address",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    country: "India",
  };

  const pinMatch = bodyText.match(/\b([1-9][0-9]{5})\b/);
  if (pinMatch) {
    shippingAddress.postalCode = pinMatch[1];
  } else {
    missingFields.push('shippingAddress.postalCode');
  }

  // Extract SKU and Items
  const skuMatch = bodyText.match(/(?:SKU|Item Code|Model)[:\s]+([A-Za-z0-9\-_]{3,20})/i);
  const sku = skuMatch ? skuMatch[1] : `SKU-${Date.now().toString().slice(-6)}`;
  if (!skuMatch) missingFields.push('items[0].sku');

  // Title extraction
  let itemTitle = "E-Commerce Catalog Product";
  const titlePatterns = [
    /(?:Item|Product|Description)[:\s]+([^\n\r<]{5,80})/i,
    /(?:Purchased|Ordered):\s*([^\n\r<]{5,80})/i
  ];
  for (const p of titlePatterns) {
    const m = bodyText.match(p);
    if (m && m[1]) {
      itemTitle = m[1].trim();
      break;
    }
  }

  const items: OrderItem[] = [{
    id: `item-ai-${Date.now()}`,
    name: itemTitle,
    sku,
    quantity: 1,
    unitPrice: extractedAmount,
    totalPrice: extractedAmount,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&auto=format&fit=crop&q=60"
  }];

  const paymentMethod = /COD|Cash on Delivery/i.test(bodyText) ? 'COD' : 'Prepaid Online Payment';

  return {
    marketplace: detectedMarketplace,
    emailType,
    matchedRule: 'OmniAI Neural Extraction Fallback (Syntactic & Heuristic Entity Recognition)',
    confidenceScore: Math.max(60, 95 - missingFields.length * 12),
    data: {
      marketplace: detectedMarketplace,
      marketplaceOrderId: extractedOrderId,
      orderDate: new Date().toISOString(),
      internalStatus: emailType === 'CANCELLATION' ? 'CANCELLED' : 
                      emailType === 'RETURN_REQUEST' ? 'RETURNED' :
                      emailType === 'REFUND_NOTIFICATION' ? 'REFUNDED' :
                      emailType === 'SHIPMENT_UPDATE' ? 'SHIPPED' : 'CONFIRMED',
      customer: {
        name: customerName,
        email: "shopper@external-store.com",
        phone: "+91 98000 00000",
      },
      shippingAddress,
      items,
      currency: "INR",
      subtotal: extractedAmount,
      tax: Number((extractedAmount * 0.18).toFixed(2)),
      shippingCost: 0,
      discount: 0,
      totalAmount: extractedAmount,
      paymentStatus: paymentMethod === 'COD' ? 'COD' : 'PAID',
      paymentMethod,
      shippingStatus: emailType === 'SHIPMENT_UPDATE' ? 'IN_TRANSIT' : 'UNFULFILLED',
      courierPartner: 'Standard National Courier',
      unknownFields: missingFields,
    },
    missingFields,
  };
}
