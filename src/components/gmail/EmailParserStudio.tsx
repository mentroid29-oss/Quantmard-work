'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  Code, 
  Zap, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  Settings2
} from 'lucide-react';
import { SAMPLE_EMAILS, SampleEmailTemplate } from '@/lib/gmail/sampleEmails';
import { MarketplaceBadge } from '@/components/common/Badges';
import { GmailConnectionState, EmailLog, ParseStatus } from '@/types';

interface EmailParserStudioProps {
  gmailState: GmailConnectionState;
  logs: EmailLog[];
  onTriggerSync: (sampleIndex?: number, customEmail?: any) => Promise<any>;
  onOpenOAuthModal: () => void;
}

export function EmailParserStudio({
  gmailState,
  logs,
  onTriggerSync,
  onOpenOAuthModal,
}: EmailParserStudioProps) {
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_EMAILS[0].id);
  const [subjectInput, setSubjectInput] = useState(SAMPLE_EMAILS[0].subject);
  const [fromInput, setFromInput] = useState(SAMPLE_EMAILS[0].from);
  const [bodyInput, setBodyInput] = useState(SAMPLE_EMAILS[0].body);
  const [parseResult, setParseResult] = useState<any>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const sample = SAMPLE_EMAILS.find(s => s.id === sampleId);
    if (sample) {
      setSubjectInput(sample.subject);
      setFromInput(sample.from);
      setBodyInput(sample.body);
      setParseResult(null);
      setIngestSuccessMessage(null);
    }
  };

  const handleRunParser = async () => {
    setIsParsing(true);
    setIngestSuccessMessage(null);
    try {
      const res = await fetch('/api/gmail/parse-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectInput,
          from: fromInput,
          body: bodyInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setParseResult(data.parseResult);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleIngestToDatabase = async () => {
    setIsIngesting(true);
    setIngestSuccessMessage(null);
    try {
      const result = await onTriggerSync(undefined, {
        subject: subjectInput,
        from: fromInput,
        body: bodyInput,
      });
      setIngestSuccessMessage(
        `Order ingested successfully! Order created: ${result.summary.ordersCreated}, Duplicates prevented: ${result.summary.duplicatesPrevented}`
      );
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gmail OAuth & Polling Configuration Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Google Gmail API Integration
              </h2>
              {gmailState.isConnected ? (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {gmailState.isDemo ? 'Connected (Demo Sandbox)' : 'Connected (OAuth 2.0)'}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Disconnected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authorized Account: <strong className="text-slate-700 dark:text-slate-300 font-mono">{gmailState.connectedEmail}</strong>
            </p>
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-4 pt-1">
              <span>Last Synced: {new Date(gmailState.lastSyncAt || Date.now()).toLocaleTimeString()}</span>
              <span>•</span>
              <span>Total Ingested: {gmailState.totalOrdersIngested} orders</span>
              <span>•</span>
              <span>Auto-sync polling every {gmailState.syncIntervalMinutes} mins</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOAuthModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            <Settings2 className="w-4 h-4" />
            <span>OAuth 2.0 Credentials</span>
          </button>
          <button
            onClick={() => onTriggerSync()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Trigger Inbox Sync</span>
          </button>
        </div>
      </div>

      {/* Interactive Email Parsing Studio (Live Testing Playground) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Interactive Email Parser & Rule Studio</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select realistic templates from Amazon, Flipkart, Meesho, Shopify, WooCommerce, Myntra, or test raw emails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Sample Template:</span>
            <select
              value={selectedSampleId}
              onChange={e => handleSelectSample(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {SAMPLE_EMAILS.map(sample => (
                <option key={sample.id} value={sample.id}>
                  [{sample.marketplace}] {sample.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input & Output Split Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Raw Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                From Address Header
              </label>
              <input
                type="text"
                value={fromInput}
                onChange={e => setFromInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Raw Email Body Content (Plain Text or HTML)
              </label>
              <textarea
                rows={12}
                value={bodyInput}
                onChange={e => setBodyInput(e.target.value)}
                className="w-full p-3 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 leading-relaxed focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleRunParser}
                disabled={isParsing}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isParsing ? 'Executing Parser Rules...' : 'Test & Extract Information'}</span>
              </button>
            </div>
          </div>

          {/* Parser Extraction Result View */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Parser Extraction Analysis</span>
                </span>
                {parseResult && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Confidence: {parseResult.confidenceScore}%
                  </span>
                )}
              </div>

              {!parseResult ? (
                <div className="py-20 text-center text-slate-400 text-xs">
                  Click <strong>"Test & Extract Information"</strong> to run the matching regex and AI extraction engines against the email.
                </div>
              ) : (
                <div className="mt-3 space-y-3 text-xs">
                  {/* Matched rule banner */}
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Detected Channel:</span>
                      <MarketplaceBadge marketplace={parseResult.marketplace} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Email Classification:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{parseResult.emailType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Matched Engine:</span>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">{parseResult.matchedRule}</span>
                    </div>
                  </div>

                  {/* Extracted Key Attributes */}
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="font-semibold text-slate-900 dark:text-white text-[11px]">Extracted Order Attributes:</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Order ID:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{parseResult.data.marketplaceOrderId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Amount:</span>
                        <span className="font-bold text-emerald-600">₹{parseResult.data.totalAmount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Customer Name:</span>
                        <span className="text-slate-800 dark:text-slate-200">{parseResult.data.customer?.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Primary SKU:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{parseResult.data.items?.[0]?.sku}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Payment Mode:</span>
                        <span className="text-slate-800 dark:text-slate-200">{parseResult.data.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Assigned Courier:</span>
                        <span className="text-slate-800 dark:text-slate-200">{parseResult.data.courierPartner || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Missing fields alert */}
                  {parseResult.missingFields && parseResult.missingFields.length > 0 ? (
                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                      <strong>Missing Fields: </strong>
                      {parseResult.missingFields.join(', ')} (Stored as unknown, available for manual staff correction).
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>All critical order fields extracted with 100% completeness.</span>
                    </div>
                  )}

                  {ingestSuccessMessage && (
                    <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                      {ingestSuccessMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ingestion Action */}
            {parseResult && (
              <button
                onClick={handleIngestToDatabase}
                disabled={isIngesting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isIngesting ? 'Ingesting to OMS...' : 'Ingest Order to Database & Inventory'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Historical Email Logs Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Email Processing Status & Error Logs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Audit trail of all incoming notification emails scanned by Gmail API</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {logs.length} Logged Messages
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Sender</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Order Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map(log => {
                const statusStyles: Record<ParseStatus, { label: string; badge: string }> = {
                  SUCCESS: { label: 'Extracted', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  PARTIAL: { label: 'Partial Fields', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
                  DUPLICATE_SKIPPED: { label: 'Duplicate Skipped', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
                  FAILED: { label: 'Failed', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
                };
                const s = statusStyles[log.status] || statusStyles.SUCCESS;

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                      {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {log.from}
                    </td>
                    <td className="py-2.5 px-3 max-w-xs truncate font-medium text-slate-800 dark:text-slate-200">
                      {log.subject}
                    </td>
                    <td className="py-2.5 px-3">
                      <MarketplaceBadge marketplace={log.marketplaceDetected} size="xs" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${s.badge}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {log.confidenceScore}%
                    </td>
                    <td className="py-2.5 px-3">
                      {log.processedOrderId ? (
                        <a 
                          href={`/orders?id=${log.processedOrderId}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-[11px]"
                        >
                          View Order
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
