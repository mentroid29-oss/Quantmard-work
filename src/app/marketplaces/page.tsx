'use client';

import React, { useState, useEffect } from 'react';
import { MarketplaceGrid } from '@/components/marketplaces/MarketplaceGrid';
import { MarketplaceConfig } from '@/types';

export default function MarketplacesPage() {
  const [marketplaces, setMarketplaces] = useState<MarketplaceConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMarketplaces = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/marketplaces');
      const data = await res.json();
      if (data.success) {
        setMarketplaces(data.marketplaces);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaces();
  }, []);

  const handleUpdateMarketplace = async (id: string, updates: Partial<MarketplaceConfig>) => {
    try {
      const res = await fetch('/api/marketplaces', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const data = await res.json();
      if (data.success) {
        setMarketplaces(prev => prev.map(m => m.id === id ? data.marketplace : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading && marketplaces.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading Marketplace Integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <MarketplaceGrid
      marketplaces={marketplaces}
      onUpdateMarketplace={handleUpdateMarketplace}
    />
  );
}
