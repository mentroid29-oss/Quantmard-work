import { EmailType, MarketplaceType, Order, OrderItem, Address } from '@/types';
import { ParseResult } from './amazon';

export function parseFlipkartEmail(subject: string, bodyText: string, fromHeader: string): ParseResult | null {
  const isFlipkart = 
    /flipkart/i.test(fromHeader) || 
    /flipkart/i.test(subject) || 
    bodyText.includes("Flipkart Seller Hub") || 
    bodyText.includes("Flipkart Internet Pvt Ltd");

  if (!isFlipkart) return null;

  let emailType: EmailType = 'ORDER_CONFIRMATION';
  if (/cancellation|cancelled/i.test(subject) || /order has been cancelled/i.test(bodyText)) {
    emailType = 'CANCELLATION';
  } else if (/return requested|return approval/i.test(subject) || /customer return initiated/i.test(bodyText)) {
    emailType = 'RETURN_REQUEST';
  } else if (/refund processed|payout adjustment/i.test(subject)) {
    emailType = 'REFUND_NOTIFICATION';
  } else if (/dispatched|handed over to ekart/i.test(subject)) {
    emailType = 'SHIPMENT_UPDATE';
  }

  // Flipkart Order ID pattern: OD followed by 16-18 digits
  const orderIdMatch = 
    subject.match(/(OD\d{16,19})/i) || 
    bodyText.match(/Order ID[:\s#]+(OD\d{16,19})/i) ||
    bodyText.match(/(OD\d{16,19})/i);
  
  const orderId = orderIdMatch ? orderIdMatch[1].toUpperCase() : `OD${Date.now()}849`;

  // Amount
  const amountMatch = 
    bodyText.match(/(?:Order Value|Total Price|Selling Price|Invoice Amount|Total)[:\s]+(?:₹|Rs\.?|INR)\s*([\d,]+\.?\d*)/i) ||
    bodyText.match(/(?:₹|Rs\.?|INR)\s*([\d,]+\.?\d*)/i);
  const totalAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 899;

  // SKU & FSN
  const fsnMatch = bodyText.match(/(?:FSN|Flipkart Serial No)[:\s]+([A-Za-z0-9]+)/i);
  const skuMatch = bodyText.match(/(?:Seller SKU|SKU ID|SKU)[:\s]+([A-Za-z0-9_-]+)/i);
  const sku = skuMatch ? skuMatch[1] : (fsnMatch ? `FK-${fsnMatch[1]}` : `SKU-FK-${Math.floor(1000 + Math.random() * 9000)}`);

  // Quantity
  const qtyMatch = bodyText.match(/(?:Quantity|Qty)[:\s]+(\d+)/i);
  const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;

  // Title
  let title = "Flipkart Catalog Product";
  const titleMatch = bodyText.match(/(?:Product Name|Listing Title|Item Description)[:\s]+([^\n\r]+)/i);
  if (titleMatch) {
    title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
  }

  // Customer & Shipping
  let customerName = "Flipkart Customer";
  const nameMatch = bodyText.match(/(?:Customer Name|Buyer|Deliver to)[:\s]+([^\n\r,]+)/i);
  if (nameMatch) {
    customerName = nameMatch[1].trim();
  }

  let shippingAddress: Address = {
    street: "Flipkart Hub Delivery Area",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
  };

  const pincodeMatch = bodyText.match(/(?:Pincode|Pin Code|ZIP)[:\s]+(\d{6})/i) || bodyText.match(/\b\d{6}\b/);
  if (pincodeMatch) {
    shippingAddress.postalCode = pincodeMatch[1] || pincodeMatch[0];
  }

  const items: OrderItem[] = [{
    id: `item-fk-${Date.now()}`,
    name: title,
    sku,
    quantity,
    unitPrice: Number((totalAmount / quantity).toFixed(2)),
    totalPrice: totalAmount,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=60"
  }];

  const paymentMethod = /COD|Cash on Delivery/i.test(bodyText) ? 'COD' : 'Prepaid (Flipkart Gateway)';

  const missingFields: string[] = [];
  if (!orderIdMatch) missingFields.push('marketplaceOrderId');
  if (!amountMatch) missingFields.push('totalAmount');
  if (!skuMatch) missingFields.push('items[0].sku');

  return {
    marketplace: 'FLIPKART',
    emailType,
    matchedRule: 'Flipkart Seller Hub Rule Engine (FSN + SLA Pattern Matching)',
    confidenceScore: missingFields.length === 0 ? 96 : 82,
    data: {
      marketplace: 'FLIPKART',
      marketplaceOrderId: orderId,
      orderDate: new Date().toISOString(),
      internalStatus: emailType === 'CANCELLATION' ? 'CANCELLED' : 
                      emailType === 'RETURN_REQUEST' ? 'RETURNED' :
                      emailType === 'REFUND_NOTIFICATION' ? 'REFUNDED' :
                      emailType === 'SHIPMENT_UPDATE' ? 'SHIPPED' : 'CONFIRMED',
      customer: {
        name: customerName,
        email: "flipkart-buyer@seller-relay.fk",
        phone: "+91 99000 88776",
      },
      shippingAddress,
      items,
      currency: "INR",
      subtotal: totalAmount,
      tax: Number((totalAmount * 0.18).toFixed(2)),
      shippingCost: 0,
      discount: 0,
      totalAmount,
      paymentStatus: paymentMethod === 'COD' ? 'COD' : 'PAID',
      paymentMethod,
      shippingStatus: emailType === 'SHIPMENT_UPDATE' ? 'IN_TRANSIT' : 'LABEL_CREATED',
      courierPartner: 'Ekart Logistics',
      unknownFields: missingFields,
    },
    missingFields,
  };
}
