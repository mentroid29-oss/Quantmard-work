import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'OmniCommerce OMS - Multi-Platform Centralized Order Management System',
  description: 'Manage Amazon, Flipkart, Meesho, Shopify, WooCommerce, Myntra, and Ajio orders with automated Gmail notification parsing and unified marketplace sync.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
