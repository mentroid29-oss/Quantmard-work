'use client';

import React, { useState, useEffect } from 'react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [repRes, ordRes] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/orders?sortBy=date&sortOrder=desc'),
      ]);
      const repData = await repRes.json();
      const ordData = await ordRes.json();
      if (repData.success) setData(repData);
      if (ordData.success) setRecentOrders(ordData.orders);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener('oms-data-updated', handleUpdate);
    return () => window.removeEventListener('oms-data-updated', handleUpdate);
  }, []);

  const handleTriggerSync = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/gmail/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const resData = await res.json();
      if (resData.success) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading Cross-Channel Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardOverview
      kpis={data.kpis}
      dailyTrend={data.dailyTrend}
      marketplaceBreakdown={data.marketplaceBreakdown}
      recentOrders={recentOrders}
      onTriggerSync={handleTriggerSync}
      isSyncing={isSyncing}
    />
  );
}
