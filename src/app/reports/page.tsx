'use client';

import React, { useState, useEffect } from 'react';
import { ReportsHub } from '@/components/reports/ReportsHub';

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) {
        setReportsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    window.location.href = '/api/orders/export';
  };

  if (isLoading && !reportsData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Aggregating Cross-Channel Financial Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <ReportsHub
      reportsData={reportsData}
      onExportCSV={handleExportCSV}
    />
  );
}
