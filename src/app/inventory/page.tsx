'use client';

import React, { useState, useEffect } from 'react';
import { InventoryHub } from '@/components/inventory/InventoryHub';
import { InventoryItem } from '@/types';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    const handleUpdate = () => fetchInventory();
    window.addEventListener('oms-data-updated', handleUpdate);
    return () => window.removeEventListener('oms-data-updated', handleUpdate);
  }, []);

  const handleAdjustStock = async (sku: string, delta: number, reason: string) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, delta, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory(prev => prev.map(i => i.sku === sku ? data.item : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading && inventory.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading Inventory Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <InventoryHub
      inventory={inventory}
      onAdjustStock={handleAdjustStock}
    />
  );
}
