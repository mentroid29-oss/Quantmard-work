'use client';

import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Search, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  PackageCheck,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { InventoryItem, MarketplaceType } from '@/types';
import { MarketplaceBadge } from '@/components/common/Badges';

interface InventoryHubProps {
  inventory: InventoryItem[];
  onAdjustStock: (sku: string, delta: number, reason: string) => Promise<void>;
}

export function InventoryHub({ inventory, onAdjustStock }: InventoryHubProps) {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('New Shipment Received from Supplier');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const lowStockItems = inventory.filter(i => i.availableStock <= i.lowStockThreshold);
  const totalAvailable = inventory.reduce((sum, i) => sum + i.availableStock, 0);
  const totalReserved = inventory.reduce((sum, i) => sum + i.reservedStock, 0);
  const totalSold = inventory.reduce((sum, i) => sum + i.soldQuantity, 0);

  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.sku.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsAdjusting(true);
    try {
      await onAdjustStock(selectedItem.sku, adjustDelta, adjustReason);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Available Stock</span>
            <Boxes className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalAvailable.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Ready to dispatch</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Reserved for Orders</span>
            <PackageCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {totalReserved.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Committed to incoming orders</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Units Sold</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalSold.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all channels</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {lowStockItems.length} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Below safety reorder threshold</div>
        </div>
      </div>

      {/* Low Stock Alert Strip */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Attention Required:</span> {lowStockItems.map(i => i.name).join(', ')} are running low. Immediate PO reorder recommended.
            </div>
          </div>
          <button 
            onClick={() => setSelectedItem(lowStockItems[0])}
            className="px-3 py-1.5 rounded-lg font-semibold bg-amber-600 text-white hover:bg-amber-700 flex-shrink-0"
          >
            Replenish Stock
          </button>
        </div>
      )}

      {/* Search & Actions */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product Name, SKU or Category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button 
          onClick={() => setSelectedItem(inventory[0])}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Adjust Inventory Quantity</span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Product & Category</th>
                <th className="py-3 px-4">Master SKU</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Total Sold</th>
                <th className="py-3 px-4">Marketplace Stock Allocation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(item => {
                const isLow = item.availableStock <= item.lowStockThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[11px] text-slate-500">{item.category} • Cost: ₹{item.costPrice} • Sell: ₹{item.sellingPrice}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 font-medium">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`text-sm font-bold ${isLow ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                          {item.availableStock}
                        </span>
                        {isLow && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-indigo-600 dark:text-indigo-400">
                      {item.reservedStock}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {item.soldQuantity}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.marketplaceAllocations.map(alloc => (
                          <span 
                            key={alloc.marketplace}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                          >
                            <span className="font-medium text-slate-700 dark:text-slate-300">{alloc.marketplace}:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{alloc.stockAllocated}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Adjust Stock: {selectedItem.sku}</h3>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="mt-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <img src={selectedItem.image} alt="" className="w-12 h-12 rounded object-cover" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedItem.name}</div>
                  <div className="text-[11px] text-slate-500">Current available: {selectedItem.availableStock} units</div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Stock Delta Adjustment (+ to add, - to reduce)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustDelta(prev => prev - 5)}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={e => setAdjustDelta(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold text-base text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustDelta(prev => prev + 5)}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  New available stock will be: <strong>{Math.max(0, selectedItem.availableStock + adjustDelta)}</strong>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Adjustment Reason & Audit Note
                </label>
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="New Shipment Received from Supplier">New Shipment Received from Supplier</option>
                  <option value="Damaged Goods / Quality Reject">Damaged Goods / Quality Reject</option>
                  <option value="Cycle Count Physical Audit Correction">Cycle Count Physical Audit Correction</option>
                  <option value="Customer Return Restocked">Customer Return Restocked</option>
                  <option value="Channel Reallocation Transfer">Channel Reallocation Transfer</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isAdjusting ? 'Updating...' : 'Commit Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
