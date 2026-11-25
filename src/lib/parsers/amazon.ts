import { EmailType, MarketplaceType, Order, OrderItem, Address } from '@/types';

export interface ParseResult {
  marketplace: MarketplaceType;
  emailType: EmailType;
  matchedRule: string;
  confidenceScore: number;
  data: Partial<Order>;
  missingFields: string[];
  rawDetails?: Record<string, any>;
}

export function parseAmazonEmail(subject: string, bodyText: string, fromHeader: string): ParseResult | null {
  const isAmazon = 
    /amazon/i.test(fromHeader) || 
    /amazon/i.test(subject) || 
    bodyText.includes("Amazon Seller Central") || 
    bodyText.includes("Amazon.in") ||
    bodyText.includes("Amazon.com");

  if (!isAmazon) return null;

  // Determine Email Type
  let emailType: EmailType = 'ORDER_CONFIRMATION';
  if (/cancellation|cancelled/i.test(subject) || /buyer has requested to cancel/i.test(bodyText)) {
    emailType = 'CANCELLATION';
  } else if (/return requested|return authorization/i.test(subject) || /return request/i.test(bodyText)) {
    emailType = 'RETURN_REQUEST';
  } else if (/refund initiated|refund issued/i.test(subject) || /refunded/i.test(bodyText)) {
    emailType = 'REFUND_NOTIFICATION';
  } else if (/dispatched|has shipped|tracking details/i.test(subject) || /package has shipped/i.test(bodyText)) {
    emailType = 'SHIPMENT_UPDATE';
  }

  // Extract Order ID: e.g. 402-9843912-1823948 or 112-9837482-1928374
  const orderIdMatch = 
    subject.match(/(\d{3}-\d{7}-\d{7})/) || 
    bodyText.match(/Order ID[:\s#]+(\d{3}-\d{7}-\d{7})/i) ||
    bodyText.match(/(\d{3}-\d{7}-\d{7})/);
  
  const orderId = orderIdMatch ? orderIdMatch[1] : `AMZ-${Date.now().toString().slice(-8)}`;

  // Extract Total Amount
  const amountMatch = 
    bodyText.match(/(?:Total|Order Total|Grand Total|Amount)[:\s]+(?:₹|Rs\.?|INR|\$)\s*([\d,]+\.?\d*)/i) ||
    bodyText.match(/(?:₹|Rs\.?|INR|\$)\s*([\d,]+\.?\d*)/);
  const totalAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

  // Extract Customer Name & Address
  let customerName = "Amazon Customer";
  const nameMatch = bodyText.match(/(?:Ship To|Customer Name|Buyer Name|Delivery To)[:\s]+([^\n\r,]+)/i);
  if (nameMatch) {
    customerName = nameMatch[1].trim();
  }

  // Shipping Address
  const addressMatch = bodyText.match(/(?:Shipping Address|Ship To|Deliver to)[:\s]+([\s\S]+?)(?=(?:Order Details|Item Subtotal|Grand Total|Payment Method|Order ID|$))/i);
  let shippingAddress: Address = {
    street: "Street address from Amazon order",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
  };

  if (addressMatch) {
    const rawAddr = addressMatch[1].replace(/<[^>]*>/g, '').trim();
    const lines = rawAddr.split(/\n+/).map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      if (lines.length >= 1) customerName = lines[0].replace(/^(Name:|\s*)/, '');
      shippingAddress.street = lines.slice(1, 3).join(', ') || lines[0];
      const pinMatch = rawAddr.match(/\b\d{6}\b/);
      if (pinMatch) shippingAddress.postalCode = pinMatch[0];
    }
  }

  // Extract Item Name and SKU
  let items: OrderItem[] = [];
  const itemBlockMatch = bodyText.match(/(?:Item Details|Items Ordered|Product Name)[:\s]+([\s\S]+?)(?=(?:Shipping Address|Subtotal|Order Total|$))/i);
  
  // Try pattern: Quantity: X, SKU: Y, Title: Z
  const skuMatch = bodyText.match(/SKU[:\s]+([A-Za-z0-9_-]+)/i);
  const sku = skuMatch ? skuMatch[1] : `SKU-AMZ-${Math.floor(1000 + Math.random() * 9000)}`;

  const qtyMatch = bodyText.match(/(?:Quantity|Qty)[:\s]+(\d+)/i);
  const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;

  let title = "Amazon Listed Merchandise";
  const titleMatch = bodyText.match(/(?:Product Name|Item)[:\s]+([^\n\r]+)/i) || 
                     bodyText.match(/1 of:?\s*([^\n\r]+)/i);
  if (titleMatch) {
    title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
  }

  items.push({
    id: `item-${Date.now()}-1`,
    name: title,
    sku: sku,
    quantity: quantity,
    unitPrice: totalAmount > 0 ? Number((totalAmount / quantity).toFixed(2)) : 499,
    totalPrice: totalAmount > 0 ? totalAmount : 499,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=60"
  });

  // Payment Method
  const paymentMethod = /Cash on Delivery|COD/i.test(bodyText) ? 'COD' : 
                        /Amazon Pay|UPI|Credit Card|Debit Card/i.test(bodyText) ? 'Prepaid (Amazon Pay/Card)' : 'Prepaid';

  const missingFields: string[] = [];
  if (!orderIdMatch) missingFields.push('marketplaceOrderId');
  if (!amountMatch) missingFields.push('totalAmount');
  if (!nameMatch && !addressMatch) missingFields.push('customer.name');
  if (!skuMatch) missingFields.push('items[0].sku');

  return {
    marketplace: 'AMAZON',
    emailType,
    matchedRule: 'Amazon Seller Notification Engine v2.4 (Regex + Layout Heuristics)',
    confidenceScore: missingFields.length === 0 ? 98 : missingFields.length === 1 ? 88 : 74,
    data: {
      marketplace: 'AMAZON',
      marketplaceOrderId: orderId,
      orderDate: new Date().toISOString(),
      internalStatus: emailType === 'CANCELLATION' ? 'CANCELLED' : 
                      emailType === 'RETURN_REQUEST' ? 'RETURNED' :
                      emailType === 'REFUND_NOTIFICATION' ? 'REFUNDED' :
                      emailType === 'SHIPMENT_UPDATE' ? 'SHIPPED' : 'CONFIRMED',
      customer: {
        name: customerName,
        email: "amazon-customer@marketplace.relay",
        phone: "+91 98200 12345",
      },
      shippingAddress,
      items,
      currency: "INR",
      subtotal: totalAmount > 0 ? totalAmount : 499,
      tax: Number(((totalAmount > 0 ? totalAmount : 499) * 0.18).toFixed(2)),
      shippingCost: 0,
      discount: 0,
      totalAmount: totalAmount > 0 ? totalAmount : 499,
      paymentStatus: paymentMethod === 'COD' ? 'COD' : 'PAID',
      paymentMethod,
      shippingStatus: emailType === 'SHIPMENT_UPDATE' ? 'IN_TRANSIT' : 'UNFULFILLED',
      courierPartner: 'Amazon Shipping (ATS)',
      unknownFields: missingFields,
    },
    missingFields,
  };
}
