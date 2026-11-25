import { Order, EmailType } from '@/types';

export function computeOrderFingerprint(marketplace: string, marketplaceOrderId: string): string {
  return `${marketplace.trim().toUpperCase()}::${marketplaceOrderId.trim().toUpperCase()}`;
}

export function isOrderDuplicate(
  existingOrders: Order[],
  marketplace: string,
  marketplaceOrderId: string
): { isDuplicate: boolean; existingOrder?: Order } {
  const targetKey = computeOrderFingerprint(marketplace, marketplaceOrderId);
  const found = existingOrders.find(
    o => computeOrderFingerprint(o.marketplace, o.marketplaceOrderId) === targetKey
  );
  return {
    isDuplicate: Boolean(found),
    existingOrder: found,
  };
}

export function determineOrderAction(
  existingOrder: Order | undefined,
  emailType: EmailType
): 'CREATE_NEW' | 'UPDATE_STATUS' | 'IGNORE_DUPLICATE' {
  if (!existingOrder) {
    return 'CREATE_NEW';
  }

  // If order already exists, handle lifecycle transitions
  if (emailType === 'CANCELLATION' && existingOrder.internalStatus !== 'CANCELLED') {
    return 'UPDATE_STATUS';
  }

  if (emailType === 'RETURN_REQUEST' && existingOrder.internalStatus !== 'RETURNED') {
    return 'UPDATE_STATUS';
  }

  if (emailType === 'REFUND_NOTIFICATION' && existingOrder.internalStatus !== 'REFUNDED') {
    return 'UPDATE_STATUS';
  }

  if (emailType === 'SHIPMENT_UPDATE' && existingOrder.shippingStatus !== 'IN_TRANSIT') {
    return 'UPDATE_STATUS';
  }

  // Otherwise, it's an identical email already processed
  return 'IGNORE_DUPLICATE';
}
