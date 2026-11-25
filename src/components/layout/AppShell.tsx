'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Mail, 
  Layers, 
  Boxes, 
  Users, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  Bell, 
  Search, 
  ChevronDown, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Store,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Trigger manual sync
  const handleTriggerSync = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/gmail/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setSyncToast({
          title: 'Gmail Sync Complete',
          desc: `Scanned ${data.summary.emailsProcessed} emails: ${data.summary.ordersCreated} created, ${data.summary.duplicatesPrevented} duplicates prevented.`,
          type: 'success',
        });
        // Dispatch refresh event
        window.dispatchEvent(new Event('oms-data-updated'));
      } else {
        setSyncToast({
          title: 'Sync Error',
          desc: data.error || 'Failed to complete Gmail sync',
          type: 'error',
        });
      }
    } catch (err: any) {
      setSyncToast({
        title: 'Network Error',
        desc: err.message,
        type: 'error',
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 5000);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'All Orders', href: '/orders', icon: ShoppingBag, badge: '509' },
    { label: 'Gmail Parser Studio', href: '/gmail-sync', icon: Mail, pulse: true },
    { label: 'Marketplaces', href: '/marketplaces', icon: Layers, badge: '7 Active' },
    { label: 'Inventory Hub', href: '/inventory', icon: Boxes },
    { label: 'Team & Audit Logs', href: '/team', icon: Users },
    { label: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none flex-shrink-0 z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                OmniCommerce
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  OMS
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Multi-Tenant Company Selector */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                AP
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  Apex Omnichannel
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  GST: 27AABCA1234F1Z5
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Gmail Sync Status Footer Card */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-indigo-100 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Gmail Ingestion
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Live</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              Auto-detecting Amazon, Flipkart, Meesho, Shopify & more.
            </p>
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Scanning Inbox...' : 'Sync Gmail Now'}
            </button>
          </div>
        </div>

        {/* User profile card */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
              AS
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Aditya Singhania</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Super Admin</div>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, SKU, customer or ID..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Sync Button */}
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm text-slate-700 dark:text-slate-200 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Scanning Gmail...' : 'Sync Gmail'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">Recent Alerts</span>
                    <button 
                      onClick={() => setUnreadCount(0)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/40">
                      <div className="font-semibold text-indigo-900 dark:text-indigo-300">New Amazon Order Ingested</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Order #404-9823412-1928374 (₹3,499) parsed from email.</div>
                    </div>
                    <div className="p-2 rounded bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100/80 dark:border-amber-900/40">
                      <div className="font-semibold text-amber-900 dark:text-amber-300">Low Stock Alert: Cushion</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Only 6 units left for SKU CUSH-LUMB-MESH-GRY.</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Cancellation Detected</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Buyer cancelled order #408-7294821. Stock auto-released.</div>
                    </div>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="block text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    View All Orders & Alerts →
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Global Toast Banner */}
        {syncToast && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl border flex items-center justify-between text-sm shadow-md transition animate-in fade-in slide-in-from-top-2 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-semibold">{syncToast.title}:</span> {syncToast.desc}
              </div>
            </div>
            <button onClick={() => setSyncToast(null)} className="text-emerald-700 dark:text-emerald-400 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 bg-white dark:bg-slate-900 h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-base text-indigo-600">OmniCommerce OMS</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 py-4 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
