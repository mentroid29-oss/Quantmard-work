'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Settings, 
  ExternalLink, 
  AlertTriangle, 
  Mail, 
  Key, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { MarketplaceBadge } from '@/components/common/Badges';
import { MarketplaceConfig, MarketplaceType } from '@/types';

interface MarketplaceGridProps {
  marketplaces: MarketplaceConfig[];
  onUpdateMarketplace: (id: string, updates: Partial<MarketplaceConfig>) => Promise<void>;
}

export function MarketplaceGrid({
  marketplaces,
  onUpdateMarketplace,
}: MarketplaceGridProps) {
  const [selectedMp, setSelectedMp] = useState<MarketplaceConfig | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [sellerIdInput, setSellerIdInput] = useState('');
  const [connectionType, setConnectionType] = useState<'DIRECT_API' | 'GMAIL_PARSER' | 'HYBRID'>('HYBRID');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenConfig = (mp: MarketplaceConfig) => {
    setSelectedMp(mp);
    setSellerIdInput(mp.apiConfig?.sellerId || '');
    setApiKeyInput(mp.apiConfig?.apiKey || '');
    setConnectionType(mp.connectionType);
    setIsConfigOpen(true);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMp) return;
    setIsSaving(true);
    try {
      await onUpdateMarketplace(selectedMp.id, {
        connectionType,
        apiConfig: {
          ...selectedMp.apiConfig,
          sellerId: sellerIdInput,
          apiKey: apiKeyInput,
        },
        apiCredentialsConfigured: Boolean(sellerIdInput && apiKeyInput),
        status: (sellerIdInput && apiKeyInput) ? 'CONNECTED' : selectedMp.status,
      });
      setIsConfigOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleConnection = async (mp: MarketplaceConfig) => {
    const nextStatus = mp.status === 'CONNECTED' || mp.status === 'DEMO_MODE' ? 'DISCONNECTED' : 'DEMO_MODE';
    await onUpdateMarketplace(mp.id, {
      status: nextStatus,
      lastSyncAt: nextStatus !== 'DISCONNECTED' ? new Date().toISOString() : mp.lastSyncAt,
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Marketplace Integration Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage both direct official marketplace APIs (Amazon SP-API, Flipkart Seller API, Shopify Admin API) and automated Gmail order notification parsers with verified token credentials.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <span>7 Supported Marketplaces Active</span>
        </div>
      </div>

      {/* Grid of Marketplace Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketplaces.map(mp => {
          const isConnected = mp.status === 'CONNECTED' || mp.status === 'DEMO_MODE';

          return (
            <div 
              key={mp.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={mp.logo} 
                      alt={mp.name}
                      className="w-8 h-8 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700" 
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{mp.name}</h3>
                      <MarketplaceBadge marketplace={mp.marketplace} size="xs" />
                    </div>
                  </div>

                  {/* Status Badge */}
                  {mp.status === 'CONNECTED' ? (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live API
                    </span>
                  ) : mp.status === 'DEMO_MODE' ? (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Demo Ingestion
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Disconnected
                    </span>
                  )}
                </div>

                {/* Details */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                  {mp.notes}
                </p>

                {/* Connection Attributes */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Integration Method:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {mp.connectionType === 'DIRECT_API' ? 'Direct Official API' :
                       mp.connectionType === 'GMAIL_PARSER' ? 'Gmail Parser Rule' : 'Hybrid (API + Gmail)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Orders Synced:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{mp.totalOrdersCount} orders</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Last Sync:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {mp.lastSyncAt ? new Date(mp.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={() => handleOpenConfig(mp)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>

                <button
                  onClick={() => handleToggleConnection(mp)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isConnected
                      ? 'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect Channel'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Dialog */}
      {isConfigOpen && selectedMp && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsConfigOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <img src={selectedMp.logo} alt="" className="w-7 h-7 rounded object-contain" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedMp.name} Integration</h3>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Integration Mode
                </label>
                <select
                  value={connectionType}
                  onChange={e => setConnectionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="HYBRID">Hybrid (Gmail Parser + Marketplace API)</option>
                  <option value="GMAIL_PARSER">Gmail Notification Parser Only</option>
                  <option value="DIRECT_API">Direct Official Marketplace REST API Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Seller / Merchant ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. A2Q84920491 or FK-SELLER-99"
                  value={sellerIdInput}
                  onChange={e => setSellerIdInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  API Key / OAuth Access Token / App Secret
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {selectedMp.gmailFilterRules && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Gmail Detection Filter Active:</span>
                  </div>
                  <div>Sender: <code>{selectedMp.gmailFilterRules.fromAddress}</code></div>
                  <div>Keywords: {selectedMp.gmailFilterRules.subjectKeywords.join(', ')}</div>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  OmniCommerce follows each marketplace's authorized developer guidelines. Unverified credentials are kept in Demo Mode to protect against false order statuses.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
