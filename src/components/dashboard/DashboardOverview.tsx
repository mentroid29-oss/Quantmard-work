'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  ArrowUpRight, 
  Layers, 
  Mail,
  ChevronRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { MarketplaceBadge, OrderStatusBadge, PaymentStatusBadge } from '@/components/common/Badges';
import { Order } from '@/types';

interface DashboardOverviewProps {
  kpis: {
    totalOrders: number;
    totalSales: number;
    totalRevenue: number;
    todayOrdersCount: number;
    todaySales: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
    cancellationRate: number;
    returnRate: number;
  };
  dailyTrend: Array<{ date: string; orders: number; revenue: number }>;
  marketplaceBreakdown: Array<{ marketplace: string; name: string; orders: number; revenue: number }>;
  recentOrders: Order[];
  onTriggerSync: () => void;
  isSyncing: boolean;
}

const MARKETPLACE_COLORS: Record<string, string> = {
  AMAZON: '#FF9900',
  FLIPKART: '#2874F0',
  MEESHO: '#843993',
  SHOPIFY: '#10b981',
  WOOCOMMERCE: '#7F54B3',
  MYNTRA: '#FF3F6C',
  AJIO: '#334155',
  CUSTOM: '#64748B',
};

export function DashboardOverview({
  kpis,
  dailyTrend,
  marketplaceBreakdown,
  recentOrders,
  onTriggerSync,
  isSyncing,
}: DashboardOverviewProps) {
  const pieData = marketplaceBreakdown
    .filter(m => m.orders > 0)
    .map(m => ({
      name: m.name,
      value: m.orders,
      color: MARKETPLACE_COLORS[m.marketplace] || '#6366f1',
    }));

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Gmail Connection Status */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-6 text-white shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Centralized Order Management Active
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Apex Multi-Platform Control Center</h1>
          <p className="text-indigo-100 text-sm max-w-2xl leading-relaxed">
            Consolidating orders across Amazon, Flipkart, Meesho, Shopify, WooCommerce, Myntra, and Ajio via automated Gmail extraction and authorized marketplace APIs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/gmail-sync"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-indigo-700 hover:bg-indigo-50 shadow-sm transition"
          >
            <Mail className="w-4 h-4" />
            <span>Open Parser Studio</span>
          </Link>
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500/30 hover:bg-indigo-500/40 text-white border border-white/20 backdrop-blur transition disabled:opacity-50"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isSyncing ? 'Syncing...' : 'Sync All Channels'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.totalOrders}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Across 7 channels</span>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Today's Orders</span>
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.todayOrdersCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            ₹{kpis.todaySales.toLocaleString('en-IN')} revenue today
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹{kpis.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Net realized sales
          </div>
        </div>

        {/* Pending & Processing */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Processing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {kpis.processingOrders + kpis.pendingOrders}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {kpis.pendingOrders} awaiting pack
          </div>
        </div>

        {/* Shipped / In-Transit */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Shipped</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {kpis.shippedOrders}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            With 4 logistics partners
          </div>
        </div>

        {/* Delivered & Completed */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Delivered</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {kpis.deliveredOrders}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {kpis.cancelledOrders} cancelled ({kpis.cancellationRate}%)
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Order & Revenue Trends</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily multi-channel performance</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#orderGrad)" name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marketplace Share Donut */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Orders by Marketplace</h2>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Distribution across connected sales channels</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {marketplaceBreakdown.map(m => (
              <div key={m.marketplace} className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: MARKETPLACE_COLORS[m.marketplace] || '#6366f1' }}
                  />
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{m.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white ml-1">{m.orders}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Centralized List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Multi-Channel Orders</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest orders ingested from Gmail and marketplace APIs</p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Marketplace</th>
                <th className="py-2.5 px-3">Product Item</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.slice(0, 6).map(order => {
                const item = order.items[0];
                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{order.orderNumber}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{order.marketplaceOrderId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <MarketplaceBadge marketplace={order.marketplace} />
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {item?.name || 'Order Item'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>SKU: {item?.sku}</span>
                        <span>Qty: {item?.quantity}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{order.customer.name}</div>
                      <div className="text-[11px] text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-3 px-3">
                      <OrderStatusBadge status={order.internalStatus} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/orders?id=${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
