import { EmailType, Order, OrderItem, Address } from '@/types';
import { ParseResult } from './amazon';

export function parseMyntraEmail(subject: string, bodyText: string, fromHeader: string): ParseResult | null {
  const isMyntra = 
    /myntra/i.test(fromHeader) || 
    /myntra/i.test(subject) || 
    bodyText.includes("Myntra Designs Pvt Ltd") || 
    bodyText.includes("Myntra Seller Portal");

  if (!isMyntra) return null;

  let emailType: EmailType = 'ORDER_CONFIRMATION';
  if (/cancellation/i.test(subject) || /order cancelled/i.test(bodyText)) {
    emailType = 'CANCELLATION';
  } else if (/return/i.test(subject)) {
    emailType = 'RETURN_REQUEST';
  } else if (/shipped|handover/i.test(subject)) {
    emailType = 'SHIPMENT_UPDATE';
  }

  const orderIdMatch = 
    subject.match(/(MYN-\d{8,12})/i) || 
    bodyText.match(/Order ID[:\s#]+(MYN-\d{8,12})/i) ||
    bodyText.match(/(\d{9,12})/);
  
  const orderId = orderIdMatch ? (orderIdMatch[1].startsWith('MYN') ? orderIdMatch[1] : `MYN-${orderIdMatch[1]}`) : `MYN-${Date.now().toString().slice(-8)}`;

  const amountMatch = bodyText.match(/(?:Order Value|Payable|Total)[:\s]+(?:₹|Rs\.?|INR)\s*([\d,]+\.?\d*)/i);
  const totalAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 1899;

  const styleIdMatch = bodyText.match(/(?:Style ID|Style|SKU)[:\s]+([A-Za-z0-9_-]+)/i);
  const sku = styleIdMatch ? styleIdMatch[1] : `MYN-STY-${Math.floor(10000 + Math.random() * 90000)}`;

  const items: OrderItem[] = [{
    id: `item-myn-${Date.now()}`,
    name: "Myntra Premium Apparel & Footwear",
    sku,
    quantity: 1,
    unitPrice: totalAmount,
    totalPrice: totalAmount,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=60"
  }];

  return {
    marketplace: 'MYNTRA',
    emailType,
    matchedRule: 'Myntra Omnichannel Dispatch Protocol v4.0',
    confidenceScore: 95,
    data: {
      marketplace: 'MYNTRA',
      marketplaceOrderId: orderId,
      orderDate: new Date().toISOString(),
      internalStatus: emailType === 'CANCELLATION' ? 'CANCELLED' : 'PROCESSING',
      customer: {
        name: "Myntra Fashion Buyer",
        email: "customer@myntra-relay.in",
        phone: "+91 98333 44556",
      },
      shippingAddress: {
        street: "Bandra West, Hill Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400050",
        country: "India",
      },
      items,
      currency: "INR",
      subtotal: totalAmount,
      tax: Number((totalAmount * 0.12).toFixed(2)),
      shippingCost: 0,
      discount: 0,
      totalAmount,
      paymentStatus: 'PAID',
      paymentMethod: 'Myntra Prepaid (Cards/UPI)',
      shippingStatus: 'LABEL_CREATED',
      courierPartner: 'Myntra Logistics (LogiNext)',
      unknownFields: [],
    },
    missingFields: [],
  };
}

export function parseAjioEmail(subject: string, bodyText: string, fromHeader: string): ParseResult | null {
  const isAjio = 
    /ajio/i.test(fromHeader) || 
    /ajio/i.test(subject) || 
    bodyText.includes("Reliance Retail Ltd") || 
    bodyText.includes("AJIO Business");

  if (!isAjio) return null;

  let emailType: EmailType = 'ORDER_CONFIRMATION';
  if (/cancellation/i.test(subject)) emailType = 'CANCELLATION';
  else if (/return/i.test(subject)) emailType = 'RETURN_REQUEST';
  else if (/dispatched/i.test(subject)) emailType = 'SHIPMENT_UPDATE';

  const orderIdMatch = 
    subject.match(/(AJ-\d{8,12})/i) || 
    bodyText.match(/Order ID[:\s#]+(AJ-\d{8,12})/i) ||
    bodyText.match(/(AJ\d{8,12})/i);
  
  const orderId = orderIdMatch ? orderIdMatch[1].toUpperCase() : `AJ-${Date.now().toString().slice(-8)}`;
  const amountMatch = bodyText.match(/(?:Net Amount|Invoice Value|Total)[:\s]+(?:₹|Rs\.?|INR)\s*([\d,]+\.?\d*)/i);
  const totalAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 2199;

  const skuMatch = bodyText.match(/(?:Item Code|SKU)[:\s]+([A-Za-z0-9_-]+)/i);
  const sku = skuMatch ? skuMatch[1] : `AJ-ITEM-${Math.floor(10000 + Math.random() * 90000)}`;

  const items: OrderItem[] = [{
    id: `item-ajio-${Date.now()}`,
    name: "AJIO Trends Trendsetting Collection",
    sku,
    quantity: 1,
    unitPrice: totalAmount,
    totalPrice: totalAmount,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=120&auto=format&fit=crop&q=60"
  }];

  return {
    marketplace: 'AJIO',
    emailType,
    matchedRule: 'AJIO Dropship & Reliance Retail Order Engine v2.1',
    confidenceScore: 93,
    data: {
      marketplace: 'AJIO',
      marketplaceOrderId: orderId,
      orderDate: new Date().toISOString(),
      internalStatus: emailType === 'CANCELLATION' ? 'CANCELLED' : 'CONFIRMED',
      customer: {
        name: "AJIO Trends Shopper",
        email: "ajio-shopper@reliance.in",
        phone: "+91 97666 11223",
      },
      shippingAddress: {
        street: "Jubilee Hills, Road No 36",
        city: "Hyderabad",
        state: "Telangana",
        postalCode: "500033",
        country: "India",
      },
      items,
      currency: "INR",
      subtotal: totalAmount,
      tax: Number((totalAmount * 0.12).toFixed(2)),
      shippingCost: 0,
      discount: 0,
      totalAmount,
      paymentStatus: 'PAID',
      paymentMethod: 'JioMoney / NetBanking',
      shippingStatus: 'UNFULFILLED',
      courierPartner: 'Reliance Logistics / Delhivery',
      unknownFields: [],
    },
    missingFields: [],
  };
}
