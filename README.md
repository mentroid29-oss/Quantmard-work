# OmniCommerce OMS - Multi-Platform Centralized Order Management System

A modern, production-ready, enterprise-grade Order Management System (OMS) designed for multi-channel e-commerce sellers and retail enterprises. OmniCommerce aggregates, normalizes, and manages orders from **Amazon, Flipkart, Meesho, Shopify, WooCommerce, Myntra, and Ajio** into a single, centralized control dashboard.

---

## 🌟 Key Highlights & Core Capabilities

### 1. Automated Gmail Ingestion & Parsing Engine (Primary Feature)
* **Official Google OAuth 2.0 Integration**: Uses least-privilege OAuth scopes (`gmail.readonly`) without ever soliciting or storing Gmail passwords.
* **Specialized Marketplace Parsers**: High-precision regex and syntactic layout matchers tailored for:
  - **Amazon**: FBA & FBM order confirmations (`\d{3}-\d{7}-\d{7}`), cancellations, returns, and ATS dispatches.
  - **Flipkart**: Seller Hub SLA alerts (`OD\d{16,19}`), FSN mapping, buyer info, and Ekart logistics.
  - **Meesho**: Supplier Panel sub-orders (`s-\d+` or `\d{10,14}`), supplier settlements, and COD tags.
  - **Shopify**: Store webhook alerts (`#\d{4,8}`), item variants, customer emails, and Razorpay/Stripe details.
  - **WooCommerce**: Transactional order receipts, billing/shipping addresses, and direct UPI/bank transfer notes.
  - **Myntra**: Omnichannel store dispatch alerts (`MYN-\d{8,12}`), style IDs, and LogiNext SLAs.
  - **Ajio**: Reliance Retail B2B & dropship order notifications (`AJ-\d{8,12}`) with net invoice values.
* **OmniAI Neural Extraction Fallback**: Recovers unstructured or unformatted order notifications with syntactic heuristic extraction and confidence scoring.
* **Cryptographic Deduplication**: Generates deterministic fingerprints (`MARKETPLACE::ORDER_ID`) to prevent duplicate orders and duplicate stock reservations.
* **Email Lifecycle Handlers**: Automatically processes order confirmations, buyer cancellations, return authorizations, refund notices, and courier handovers.
* **Interactive Email Parser Studio**: Built-in test sandbox to paste raw email text, select sample templates, inspect confidence metrics, and ingest orders directly.
* **Missing Field Fallback & Manual Correction**: Flags missing email attributes as `unknownFields` and provides a manual modal to correct customer or shipping data.

---

### 2. Centralized Order Hub
* **Unified Table**: Order ID, Marketplace Badges, Timestamps, Product Thumbnails, SKU, Quantity, Customer Info, Total Amount, Payment Status, Shipping Status, and Internal Status.
* **Multi-Faceted Filtering & Search**: Instant real-time filtering by channel, status (Pending, Confirmed, Packed, Shipped, Delivered, Cancelled, Returned), payment mode (Prepaid, COD, Refunded), and search terms.
* **Bulk Order Operations**: Bulk status transitions (e.g. mark 10 orders as PACKED or SHIPPED) and bulk CSV/Excel exports.
* **Detailed Order Drawer**: Complete customer shipping address, multi-item breakdown, payment transaction info, timeline audit trail, internal staff notes, and raw email inspector.
* **Internal Status vs. Marketplace Disclaimer**: Explicitly informs staff that internal status updates do not mutate the external marketplace state without authorized writeback APIs.

---

### 3. Inventory & Stock Allocation Hub
* **Real-time Stock Tracking**: Available Stock, Reserved Stock, and Lifetime Sold Quantities.
* **Channel-Wise Stock Allocation**: Visual breakdown of inventory distribution across Amazon, Flipkart, Meesho, Shopify, WooCommerce, Myntra, and Ajio.
* **Low-Stock Safety Alerts**: Visual indicators and top banners when available stock breaches safety thresholds.
* **Stock Adjustment Audit Logs**: Stock change modal supporting additions/deductions with mandatory reason logging (new shipments, cycle counts, customer returns, or damage rejects).

---

### 4. Marketplace Integration Management
* Dedicated integration status cards for Amazon, Flipkart, Meesho, Shopify, WooCommerce, Myntra, and Ajio.
* Dual integration support: Official direct REST/GraphQL APIs (Amazon SP-API, Flipkart Seller API, Shopify Admin API) and Gmail webhook/polling.
* Verifiable credential checks with clearly indicated Demo Mode flags to prevent false connectivity claims.

---

### 5. Team Management & Role-Based Access Control (RBAC)
* Five granular roles:
  - **Super Admin**: Master tenant governance, OAuth client credentials, and team configuration.
  - **Admin**: Marketplace API keys, inventory safety thresholds, and member invites.
  - **Order Manager**: Order processing, customer notes, and manual data corrections.
  - **Warehouse Staff**: Order packing, barcode dispatching, and stock cycle count adjustments.
  - **Viewer**: Read-only financial dashboards and operational reports.
* **Activity Audit Logs**: Chronological immutable record of actions (who changed an order, when stock was updated, when Gmail was synced).

---

### 6. Reports, Analytics & Financial Intelligence
* KPI summaries: Gross Sales, Net Revenue, Today's Orders, Average Order Value (AOV), Cancellation Rate, and Return Rate.
* Visual Area and Bar charts powered by Recharts.
* Channel performance tables with revenue share percentages.
* Top-selling products by volume and revenue.
* 1-click downloads in Excel/CSV and printable PDF formats.

---

### 7. Modern UI/UX Design
* Inspired by **Shopify Admin** and **Stripe Dashboard**.
* Professional clean layout with subtle light grey backgrounds (`#f8fafc`) and indigo/purple accents (`#4f46e5`).
* Responsive sidebar and topbar with tenant organization selector.
* Interactive notification center with unread counters and severity indicators.
* Toggleable dark mode.

---

## 🚀 Running the Application Locally

The application is deployed and running live:
* **Local Web Interface**: `http://localhost:3000`
* **Project Directory**: `C:\Users\jiten\.gemini\antigravity\scratch\omnicommerce-oms`

To restart or run in development mode:
```bash
cd "C:\Users\jiten\.gemini\antigravity\scratch\omnicommerce-oms"
npm run dev
```

To run the production build:
```bash
npm run build
npm start
```

---

## 📂 Architecture & Directory Structure

```
omnicommerce-oms/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── gmail/           # sync, parse-test, oauth endpoints
│   │   │   ├── orders/          # list, update, bulk, export endpoints
│   │   │   ├── inventory/       # stock adjustment endpoints
│   │   │   ├── marketplaces/    # channel credentials endpoints
│   │   │   ├── team/            # RBAC directory endpoints
│   │   │   ├── notifications/   # in-app alert endpoints
│   │   │   └── reports/         # analytics & KPI aggregations
│   │   ├── page.tsx             # Executive Dashboard
│   │   ├── orders/page.tsx      # All Orders & Detail Drawer
│   │   ├── gmail-sync/page.tsx  # Gmail API & Parser Studio
│   │   ├── marketplaces/page.tsx# Marketplace Integrations
│   │   ├── inventory/page.tsx   # Inventory Management Hub
│   │   ├── team/page.tsx        # Team Members & Activity Logs
│   │   ├── reports/page.tsx     # Financial & Operational Reports
│   │   ├── settings/page.tsx    # Multi-Tenant & Security Settings
│   │   └── layout.tsx           # Shell Layout & Theme
│   ├── components/
│   │   ├── common/              # Badges, Status pills, Icons
│   │   ├── layout/              # Sidebar, Topbar, AppShell
│   │   ├── dashboard/           # KPI cards, Recharts visualizations
│   │   ├── orders/              # OrderTable, DetailDrawer, ManualCorrectionModal
│   │   ├── gmail/               # EmailParserStudio, GmailOAuthModal
│   │   ├── marketplaces/        # MarketplaceGrid, API configuration dialog
│   │   ├── inventory/           # InventoryHub, StockAdjustmentModal
│   │   ├── team/                # TeamManagement, MemberInviteModal
│   │   └── reports/             # ReportsHub, CSV/PDF actions
│   ├── lib/
│   │   ├── db.ts                # Multi-tenant data store & thread-safe persistence
│   │   ├── parsers/             # Amazon, Flipkart, Meesho, Shopify, WooCommerce, Myntra, Ajio, AI fallback
│   │   ├── gmail/               # Deduplication, OAuth state, sample email corpus
│   │   ├── marketplaces/        # Registry and credential profiles
│   │   └── export/              # UTF-8 BOM CSV & Excel generators
│   └── types/
│       └── index.ts             # Strict TypeScript domain interfaces
├── tailwind.config.ts           # Custom color scales & typography
├── tsconfig.json                # TypeScript 5 compilation setup
└── package.json                 # Dependencies & build scripts
```
#   Q u a n t m a r d - w o r k  
 