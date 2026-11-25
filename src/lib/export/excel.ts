import { Order } from '@/types';

export function generateOrdersCSV(orders: Order[]): string {
  const headers = [
    'Order ID',
    'Marketplace Order ID',
    'Marketplace',
    'Order Date',
    'Internal Status',
    'Marketplace Status',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Shipping Address',
    'City',
    'State',
    'PIN Code',
    'SKU',
    'Product Name',
    'Quantity',
    'Unit Price',
    'Order Amount (INR)',
    'Payment Status',
    'Payment Method',
    'Shipping Status',
    'Courier Partner',
    'Tracking Number',
  ];

  const rows = orders.map(order => {
    const item = order.items[0] || { sku: '', name: '', quantity: 1, unitPrice: order.totalAmount };
    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    return [
      escape(order.orderNumber),
      escape(order.marketplaceOrderId),
      escape(order.marketplace),
      escape(new Date(order.orderDate).toLocaleString('en-IN')),
      escape(order.internalStatus),
      escape(order.marketplaceStatus || 'N/A'),
      escape(order.customer?.name || 'Customer'),
      escape(order.customer?.email || 'N/A'),
      escape(order.customer?.phone || 'N/A'),
      escape(order.shippingAddress?.street || ''),
      escape(order.shippingAddress?.city || ''),
      escape(order.shippingAddress?.state || ''),
      escape(order.shippingAddress?.postalCode || ''),
      escape(item.sku),
      escape(item.name),
      escape(item.quantity),
      escape(item.unitPrice),
      escape(order.totalAmount),
      escape(order.paymentStatus),
      escape(order.paymentMethod),
      escape(order.shippingStatus),
      escape(order.courierPartner || 'Pending'),
      escape(order.trackingNumber || 'N/A'),
    ].join(',');
  });

  // Include UTF-8 BOM so Microsoft Excel correctly parses Unicode characters
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}
