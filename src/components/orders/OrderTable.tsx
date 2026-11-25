'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  ChevronDown, 
  CheckSquare, 
  Square, 
  MoreHorizontal, 
  Eye, 
  FileEdit, 
  ArrowUpDown, 
  Calendar,
  Layers,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MarketplaceBadge, OrderStatusBadge, PaymentStatusBadge } from '@/components/common/Badges';
import { Order, MarketplaceType, InternalOrderStatus, PaymentStatus } from '@/types';

interface OrderTableProps {
  orders: Order[];
  onOpenDetails: (order: Order) => void;
  onOpenManualCorrection: (order: Order) => void;
  onBulkStatusUpdate: (orderIds: string[], status: InternalOrderStatus) => Promise<void>;
  onExportOrders: (orderIds?: string[]) => void;
}

export function OrderTable({
  orders,
  onOpenDetails,
  onOpenManualCorrection,
  onBulkStatusUpdate,
  onExportOrders,
}: OrderTableProps) {
  const [search, setSearch] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPayment, setSelectedPayment] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

  // Filter & Sort
  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
        if (selectedMarketplace !== 'ALL' && o.marketplace !== selectedMarketplace) return false;
        if (selectedStatus !== 'ALL' && o.internalStatus !== selectedStatus) return false;
        if (selectedPayment !== 'ALL' && o.paymentStatus !== selectedPayment) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchOrderNo = o.orderNumber.toLowerCase().includes(q);
          const matchMarketplaceId = o.marketplaceOrderId.toLowerCase().includes(q);
          const matchCustomer = o.customer.name.toLowerCase().includes(q);
          const matchItem = o.items.some(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
          if (!matchOrderNo && !matchMarketplaceId && !matchCustomer && !matchItem) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
        }
        const timeA = new Date(a.orderDate).getTime();
        const timeB = new Date(b.orderDate).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
  }, [orders, selectedMarketplace, selectedStatus, selectedPayment, search, sortBy, sortOrder]);

  // Selection
  const allSelected = filteredOrders.length > 0 && selectedIds.length === filteredOrders.length;
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatus = async (status: InternalOrderStatus) => {
    if (selectedIds.length === 0) return;
    setIsUpdatingBulk(true);
    await onBulkStatusUpdate(selectedIds, status);
    setSelectedIds([]);
    setBulkStatusOpen(false);
    setIsUpdatingBulk(false);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Marketplace ID, SKU, or Customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Marketplace Filter */}
          <select
            value={selectedMarketplace}
            onChange={e => setSelectedMarketplace(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Marketplaces</option>
            <option value="AMAZON">Amazon</option>
            <option value="FLIPKART">Flipkart</option>
            <option value="MEESHO">Meesho</option>
            <option value="SHOPIFY">Shopify</option>
            <option value="WOOCOMMERCE">WooCommerce</option>
            <option value="MYNTRA">Myntra</option>
            <option value="AJIO">Ajio</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned</option>
          </select>

          {/* Payment Filter */}
          <select
            value={selectedPayment}
            onChange={e => setSelectedPayment(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Prepaid</option>
            <option value="COD">Cash on Delivery</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>

          {/* Export to Excel & CSV */}
          <button
            onClick={() => onExportOrders(selectedIds.length > 0 ? selectedIds : undefined)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export CSV / Excel'}</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Strip */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-200">
            <span>{selectedIds.length} orders selected</span>
            <button 
              onClick={() => setSelectedIds([])}
              className="text-[11px] underline text-indigo-600 dark:text-indigo-400 font-normal hover:opacity-80"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
                disabled={isUpdatingBulk}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                <span>Bulk Update Status</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {bulkStatusOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-20">
                  <button
                    onClick={() => handleBulkStatus('PROCESSING')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => handleBulkStatus('PACKED')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Mark Packed
                  </button>
                  <button
                    onClick={() => handleBulkStatus('SHIPPED')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Mark Shipped
                  </button>
                  <button
                    onClick={() => handleBulkStatus('DELIVERED')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Mark Delivered
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onExportOrders(selectedIds)}
              className="px-3 py-1.5 rounded-lg font-semibold border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50"
            >
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {allSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Marketplace</th>
                <th className="py-3 px-3">Order Date</th>
                <th className="py-3 px-3">Product Image & Name</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Shipping</th>
                <th className="py-3 px-3">Internal Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-semibold text-slate-700 dark:text-slate-300">No orders match criteria</div>
                      <p className="text-[11px] text-slate-400">
                        Try modifying search terms, resetting marketplace filters, or syncing new orders via the Gmail Integration tab.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const item = order.items[0];
                  const isSelected = selectedIds.includes(order.id);

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                        isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <button onClick={() => toggleSelectRow(order.id)}>
                          {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-medium">
                        <button 
                          onClick={() => onOpenDetails(order)}
                          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline block text-left"
                        >
                          {order.orderNumber}
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[120px]">
                          {order.marketplaceOrderId}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <MarketplaceBadge marketplace={order.marketplace} />
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        <div>{new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                        <div className="text-[10px] text-slate-400">{new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="py-3 px-3 max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <img
                            src={item?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120'}
                            alt={item?.name || 'Product'}
                            className="w-8 h-8 rounded-md object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <span className="truncate font-medium text-slate-800 dark:text-slate-200" title={item?.name}>
                            {item?.name || 'Assorted Merchandise'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500 max-w-[100px] truncate" title={item?.sku}>
                        {item?.sku || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {item?.quantity || 1}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{order.customer.name}</div>
                        <div className="text-[10px] text-slate-400">{order.shippingAddress.city}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        <div className="text-[11px] font-medium">{order.shippingStatus}</div>
                        <div className="text-[10px] text-slate-400">{order.courierPartner || 'Awaiting dispatch'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <OrderStatusBadge status={order.internalStatus} />
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenDetails(order)}
                            className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="View Full Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenManualCorrection(order)}
                            className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Manual Field Correction"
                          >
                            <FileEdit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination count */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> total orders
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Auto-refreshing live sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}
