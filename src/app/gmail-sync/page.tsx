'use client';

import React, { useState, useEffect } from 'react';
import { EmailParserStudio } from '@/components/gmail/EmailParserStudio';
import { GmailOAuthModal } from '@/components/gmail/GmailOAuthModal';
import { GmailConnectionState, EmailLog } from '@/types';

export default function GmailSyncPage() {
  const [gmailState, setGmailState] = useState<GmailConnectionState | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isOAuthOpen, setIsOAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSyncData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/gmail/sync');
      const data = await res.json();
      if (data.success) {
        setGmailState(data.state);
        setLogs(data.recentLogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncData();
  }, []);

  const handleTriggerSync = async (sampleIndex?: number, customEmail?: any) => {
    const res = await fetch('/api/gmail/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sampleIndex, customEmail }),
    });
    const data = await res.json();
    if (data.success) {
      setGmailState(data.gmailState);
      setLogs(prev => [...data.logs, ...prev]);
      window.dispatchEvent(new Event('oms-data-updated'));
    }
    return data;
  };

  const handleSaveOAuth = async (config: any) => {
    const res = await fetch('/api/gmail/oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    if (data.success) {
      setGmailState(data.state);
    }
  };

  if (isLoading && !gmailState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Connecting to Gmail Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EmailParserStudio
        gmailState={gmailState!}
        logs={logs}
        onTriggerSync={handleTriggerSync}
        onOpenOAuthModal={() => setIsOAuthOpen(true)}
      />

      {isOAuthOpen && (
        <GmailOAuthModal
          isOpen={isOAuthOpen}
          onClose={() => setIsOAuthOpen(false)}
          currentState={gmailState!}
          onSaveOAuth={handleSaveOAuth}
        />
      )}
    </div>
  );
}
