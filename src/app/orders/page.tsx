'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderTable } from '@/components/orders/OrderTable';
import { OrderDetailDrawer } from '@/components/orders/OrderDetailDrawer';
import { ManualCorrectionModal } from '@/components/orders/ManualCorrectionModal';
import { Order, InternalOrderStatus } from '@/types';
import { ShoppingBag, RefreshCw } from 'lucide-react';

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('id');

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [correctionOrder, setCorrectionOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        if (initialOrderId) {
          const match = data.orders.find((o: Order) => o.id === initialOrderId);
          if (match) setSelectedOrder(match);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleUpdate = () => fetchOrders();
    window.addEventListener('oms-data-updated', handleUpdate);
    return () => window.removeEventListener('oms-data-updated', handleUpdate);
  }, [initialOrderId]);

  const handleUpdateStatus = async (orderId: string, status: InternalOrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { internalStatus: status } }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (orderId: string, content: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, author: 'Aditya Singhania', role: 'SUPER_ADMIN' }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveManualCorrection = async (orderId: string, updates: Partial<Order>) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkStatusUpdate = async (orderIds: string[], status: InternalOrderStatus) => {
    try {
      const res = await fetch('/api/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds, action: 'UPDATE_STATUS', status }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportOrders = (orderIds?: string[]) => {
    if (orderIds && orderIds.length > 0) {
      fetch('/api/orders/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds }),
      })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `OMS_Selected_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
          a.click();
        });
    } else {
      window.location.href = '/api/orders/export';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <span>Centralized Orders Hub</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time feed of multi-channel orders with automated deduplication and manual correction options.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Main Order Table */}
      <OrderTable
        orders={orders}
        onOpenDetails={order => setSelectedOrder(order)}
        onOpenManualCorrection={order => setCorrectionOrder(order)}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onExportOrders={handleExportOrders}
      />

      {/* Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
          onOpenManualCorrection={order => setCorrectionOrder(order)}
        />
      )}

      {/* Manual Field Correction Modal */}
      {correctionOrder && (
        <ManualCorrectionModal
          order={correctionOrder}
          isOpen={Boolean(correctionOrder)}
          onClose={() => setCorrectionOrder(null)}
          onSave={handleSaveManualCorrection}
        />
      )}
    </div>
  );
}

export default function AllOrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs text-slate-500">Loading orders workspace...</div>
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}
