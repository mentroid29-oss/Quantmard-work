import React from 'react';
import { MarketplaceType, InternalOrderStatus, PaymentStatus, ShippingStatus } from '@/types';
import { ShoppingCart, ShoppingBag, Store, Globe, Tag, Sparkles, CheckCircle2, Clock, AlertTriangle, XCircle, Truck, PackageCheck, RotateCcw } from 'lucide-react';

export const MARKETPLACE_CONFIG: Record<MarketplaceType, { label: string; bg: string; text: string; border: string; dot: string; icon: any }> = {
  AMAZON: {
    label: 'Amazon',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    icon: ShoppingCart,
  },
  FLIPKART: {
    label: 'Flipkart',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-600',
    icon: ShoppingBag,
  },
  MEESHO: {
    label: 'Meesho',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-600',
    icon: Store,
  },
  SHOPIFY: {
    label: 'Shopify',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-600',
    icon: Globe,
  },
  WOOCOMMERCE: {
    label: 'WooCommerce',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800',
    dot: 'bg-violet-600',
    icon: Store,
  },
  MYNTRA: {
    label: 'Myntra',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
    icon: Tag,
  },
  AJIO: {
    label: 'Ajio',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-800 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-700',
    dot: 'bg-slate-700 dark:bg-slate-300',
    icon: ShoppingBag,
  },
  CUSTOM: {
    label: 'Custom Webstore',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-500',
    icon: Sparkles,
  },
};

export function MarketplaceBadge({ marketplace, size = 'sm' }: { marketplace: MarketplaceType; size?: 'xs' | 'sm' | 'md' }) {
  const config = MARKETPLACE_CONFIG[marketplace] || MARKETPLACE_CONFIG.CUSTOM;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'text-[11px] px-1.5 py-0.5 gap-1 font-medium',
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-sm px-2.5 py-1 gap-2 font-medium',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: InternalOrderStatus }) {
  const map: Record<InternalOrderStatus, { label: string; bg: string; text: string; icon: any }> = {
    PENDING: { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800', icon: Clock },
    CONFIRMED: { label: 'Confirmed', bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800', icon: CheckCircle2 },
    PROCESSING: { label: 'Processing', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800', icon: Clock },
    PACKED: { label: 'Packed', bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800', icon: PackageCheck },
    SHIPPED: { label: 'Shipped', bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800', icon: Truck },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800', icon: Truck },
    DELIVERED: { label: 'Delivered', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800', icon: CheckCircle2 },
    CANCELLED: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800', icon: XCircle },
    RETURNED: { label: 'Returned', bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800', icon: RotateCcw },
    REFUNDED: { label: 'Refunded', bg: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700', icon: RotateCcw },
  };

  const item = map[status] || { label: status, bg: 'bg-gray-100 text-gray-700', icon: Clock };
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {item.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; bg: string; text: string }> = {
    PAID: { label: 'Prepaid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' },
    COD: { label: 'Cash on Delivery', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400' },
    PENDING: { label: 'Payment Pending', bg: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300' },
    FAILED: { label: 'Payment Failed', bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400' },
    REFUNDED: { label: 'Refunded', bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300' },
    PARTIALLY_REFUNDED: { label: 'Partially Refunded', bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400' },
    UNKNOWN: { label: 'Unknown', bg: 'bg-gray-100 text-gray-600 border-gray-200' },
  };

  const item = map[status] || map.UNKNOWN;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${item.bg}`}>
      {item.label}
    </span>
  );
}
