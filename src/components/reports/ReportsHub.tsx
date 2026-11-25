'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  TrendingUp, 
  RotateCcw, 
  XCircle, 
  DollarSign, 
  ShoppingBag,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';
import { MarketplaceBadge } from '@/components/common/Badges';
import { MarketplaceType } from '@/types';

interface ReportsHubProps {
  reportsData: {
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
    topProducts: Array<{ sku: string; name: string; quantity: number; revenue: number }>;
  };
  onExportCSV: () => void;
}

export function ReportsHub({ reportsData, onExportCSV }: ReportsHubProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'ytd'>('7d');
  const { kpis, dailyTrend, marketplaceBreakdown, topProducts } = reportsData;

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Reports, Analytics & Financial Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consolidated cross-channel audit reports ready for accounting, inventory valuation, and GST filing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel / CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Printable / PDF View</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Gross Merchandise Value (GMV)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹{kpis.totalSales.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Total marketplace orders</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Net Realized Revenue</div>
          <div className="text-2xl font-bold text-emerald-600">
            ₹{kpis.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Excludes cancelled orders</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Average Order Value (AOV)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹{kpis.totalOrders > 0 ? Math.round(kpis.totalRevenue / kpis.totalOrders).toLocaleString('en-IN') : 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all platforms</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Cancellation & Return Rate</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.cancellationRate}% <span className="text-xs font-normal text-slate-400">/ {kpis.returnRate}%</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cancellation / Return %</div>
        </div>
      </div>

      {/* Daily/Weekly Trend Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Daily Order Volume & Revenue</h3>
            <p className="text-xs text-slate-500">Chronological analysis of incoming orders</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Past 7 Days
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Marketplace Breakdown Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Marketplace Performance Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Marketplace</th>
                <th className="py-2.5 px-4 text-center">Orders Received</th>
                <th className="py-2.5 px-4 text-right">Net Revenue</th>
                <th className="py-2.5 px-4 text-right">Average Order Value</th>
                <th className="py-2.5 px-4 text-center">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {marketplaceBreakdown.map(mp => {
                const share = kpis.totalRevenue > 0 ? Math.round((mp.revenue / kpis.totalRevenue) * 100) : 0;
                const aov = mp.orders > 0 ? Math.round(mp.revenue / mp.orders) : 0;

                return (
                  <tr key={mp.marketplace} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <MarketplaceBadge marketplace={mp.marketplace as MarketplaceType} />
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {mp.orders}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      ₹{mp.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      ₹{aov.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Product-Wise Sales & Velocity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Master SKU</th>
                <th className="py-2.5 px-4">Product Name</th>
                <th className="py-2.5 px-4 text-center">Units Sold</th>
                <th className="py-2.5 px-4 text-right">Gross Sales (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topProducts.map(p => (
                <tr key={p.sku} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                    {p.sku}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                    {p.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    ₹{p.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
