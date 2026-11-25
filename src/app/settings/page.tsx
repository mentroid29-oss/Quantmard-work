'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Database, 
  Mail, 
  Key, 
  CheckCircle2, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const [tenantName, setTenantName] = useState('Apex Omnichannel Retailers Ltd.');
  const [gstin, setGstin] = useState('27AABCA1234F1Z5');
  const [supportEmail, setSupportEmail] = useState('operations@apexretail.io');
  const [currency, setCurrency] = useState('INR');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>System & Tenant Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Multi-tenant isolation, GST taxation settings, and OAuth 2.0 security parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Tenant settings saved successfully!</span>
        </div>
      )}

      {/* Tenant Company Profile */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Tenant Organization Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Registered Company / Business Entity Name
            </label>
            <input
              type="text"
              required
              value={tenantName}
              onChange={e => setTenantName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              GSTIN / Tax Identification
            </label>
            <input
              type="text"
              required
              value={gstin}
              onChange={e => setGstin(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Primary Support & Invoicing Email
            </label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Base Currency & Locale
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          >
            Update Tenant Profile
          </button>
        </div>
      </form>

      {/* Multi-Tenant Security & Isolation architecture card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Security & Multi-Tenant Data Isolation</h2>
        </div>

        <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Tenant Scoping Key (Tenant ID):</span>
            <code className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">company-apex-retail</code>
            <p className="text-slate-500 mt-1">
              All database queries, order lookups, inventory tables, and email audit logs are partition-scoped to this tenant ID. No cross-tenant access is permitted at the query layer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>OAuth Token Protection</span>
              </span>
              <p className="text-slate-500 text-[10px]">
                Tokens are stored encrypted at rest with AES-256-GCM. Gmail passwords are never solicited or stored.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>Duplicate Prevention Fingerprinting</span>
              </span>
              <p className="text-slate-500 text-[10px]">
                Incoming emails are evaluated against <code>MARKETPLACE::ORDER_ID</code> cryptographic hashes to eliminate duplicate stock reservations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
