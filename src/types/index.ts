export type MarketplaceType = 
  | 'AMAZON'
  | 'FLIPKART'
  | 'MEESHO'
  | 'SHOPIFY'
  | 'WOOCOMMERCE'
  | 'MYNTRA'
  | 'AJIO'
  | 'CUSTOM';

export type InternalOrderStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentStatus = 'PAID' | 'PENDING' | 'COD' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'UNKNOWN';

export type ShippingStatus = 'UNFULFILLED' | 'LABEL_CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_DELIVERY' | 'RETURN_IN_TRANSIT' | 'RETURN_RECEIVED';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ORDER_MANAGER' | 'WAREHOUSE_STAFF' | 'VIEWER';

export type EmailType = 
  | 'ORDER_CONFIRMATION'
  | 'CANCELLATION'
  | 'RETURN_REQUEST'
  | 'REFUND_NOTIFICATION'
  | 'SHIPMENT_UPDATE'
  | 'UNKNOWN';

export type ParseStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'DUPLICATE_SKIPPED';

export interface Address {
  name?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  landmark?: string;
}

export interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
  variant?: string;
  taxAmount?: number;
  discountAmount?: number;
}

export interface OrderTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  source: 'GMAIL_EMAIL' | 'MARKETPLACE_API' | 'MANUAL_STAFF' | 'SYSTEM_CRON';
  actor?: string;
}

export interface OrderInternalNote {
  id: string;
  author: string;
  authorRole: UserRole;
  createdAt: string;
  content: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string; // Internal sequential OMS-xxx
  marketplaceOrderId: string; // e.g. 402-8374921-2948293
  marketplace: MarketplaceType;
  orderDate: string; // ISO
  internalStatus: InternalOrderStatus;
  marketplaceStatus?: string; // Live marketplace status string
  customer: Customer;
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  currency: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string; // e.g. "Prepaid", "COD", "Amazon Pay", "UPI"
  shippingStatus: ShippingStatus;
  courierPartner?: string; // e.g. "BlueDart", "Delhivery", "ATS", "Ecom Express"
  trackingNumber?: string;
  gmailNotificationId?: string;
  rawEmailSubject?: string;
  rawEmailSnippet?: string;
  timeline: OrderTimelineEvent[];
  notes: OrderInternalNote[];
  isManualCorrection: boolean;
  unknownFields: string[]; // e.g. ['shippingAddress.phone', 'courierPartner']
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceConfig {
  id: string;
  marketplace: MarketplaceType;
  name: string;
  logo: string;
  connectionType: 'GMAIL_PARSER' | 'DIRECT_API' | 'HYBRID';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'DEMO_MODE';
  lastSyncAt?: string;
  totalOrdersCount: number;
  apiCredentialsConfigured: boolean;
  apiConfig?: {
    sellerId?: string;
    apiKey?: string;
    appSecret?: string;
    region?: string;
    storeUrl?: string;
    accessToken?: string;
  };
  gmailFilterRules?: {
    fromAddress: string;
    subjectKeywords: string[];
    bodyKeywords: string[];
  };
  notes?: string;
}

export interface GmailConnectionState {
  isConnected: boolean;
  isDemo: boolean;
  connectedEmail?: string;
  connectedAt?: string;
  lastSyncAt?: string;
  nextScheduledSyncAt?: string;
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  totalEmailsScanned: number;
  totalOrdersIngested: number;
  unreadSyncPending: number;
  oauthConfig: {
    clientId: string;
    clientSecretSet: boolean;
    redirectUri: string;
    scopes: string[];
  };
}

export interface EmailLog {
  id: string;
  tenantId: string;
  messageId: string;
  subject: string;
  from: string;
  date: string;
  marketplaceDetected: MarketplaceType;
  emailType: EmailType;
  status: ParseStatus;
  matchedRules: string[];
  extractedData: Partial<Order>;
  missingFields: string[];
  confidenceScore: number; // 0 to 100%
  errorMessage?: string;
  processedOrderId?: string;
  isRead: boolean;
  rawSnippet: string;
  rawHtmlSnippet?: string;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  barcode?: string;
  category: string;
  image: string;
  costPrice: number;
  sellingPrice: number;
  availableStock: number;
  reservedStock: number;
  soldQuantity: number;
  totalStock: number;
  lowStockThreshold: number;
  marketplaceAllocations: {
    marketplace: MarketplaceType;
    stockAllocated: number;
    salesCount: number;
  }[];
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  lastActive: string;
  assignedMarketplaces?: MarketplaceType[];
}

export interface ActivityLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'ORDER' | 'INVENTORY' | 'MARKETPLACE' | 'GMAIL' | 'TEAM' | 'SETTING';
  entityId: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AppNotification {
  id: string;
  tenantId: string;
  title: string;
  message: string;
  type: 'NEW_ORDER' | 'CANCELLATION' | 'RETURN' | 'REFUND' | 'LOW_STOCK' | 'GMAIL_EXPIRED' | 'SYNC_ERROR' | 'INFO';
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface TenantCompany {
  id: string;
  name: string;
  businessName: string;
  gstin?: string;
  currency: string;
  timezone: string;
  logo?: string;
  supportEmail: string;
}
