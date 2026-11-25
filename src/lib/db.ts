import fs from 'fs';
import path from 'path';
import { 
  Order, 
  InventoryItem, 
  MarketplaceConfig, 
  GmailConnectionState, 
  EmailLog, 
  TeamMember, 
  ActivityLog, 
  AppNotification, 
  TenantCompany,
  InternalOrderStatus 
} from '@/types';
import { INITIAL_MARKETPLACES } from './marketplaces/registry';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'oms-store.json');

export interface DatabaseSchema {
  tenant: TenantCompany;
  marketplaces: MarketplaceConfig[];
  gmail: GmailConnectionState;
  orders: Order[];
  inventory: InventoryItem[];
  emailLogs: EmailLog[];
  teamMembers: TeamMember[];
  activityLogs: ActivityLog[];
  notifications: AppNotification[];
}

// Initial realistic seed database
const DEFAULT_SEED_DATA: DatabaseSchema = {
  tenant: {
    id: 'company-apex-retail',
    name: 'Apex Omnichannel Retailers Ltd.',
    businessName: 'Apex Omnichannel Private Limited',
    gstin: '27AABCA1234F1Z5',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    supportEmail: 'operations@apexretail.io',
  },
  gmail: {
    isConnected: true,
    isDemo: true,
    connectedEmail: 'seller-orders@apexretail.io',
    connectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    nextScheduledSyncAt: new Date(Date.now() + 1000 * 60 * 18).toISOString(),
    autoSyncEnabled: true,
    syncIntervalMinutes: 30,
    totalEmailsScanned: 842,
    totalOrdersIngested: 509,
    unreadSyncPending: 3,
    oauthConfig: {
      clientId: '8492019482-apps.googleusercontent.com',
      clientSecretSet: true,
      redirectUri: 'http://localhost:3000/api/gmail/oauth/callback',
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    },
  },
  marketplaces: INITIAL_MARKETPLACES,
  orders: [
    {
      id: 'ord-101',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1001',
      marketplaceOrderId: '404-9823412-1928374',
      marketplace: 'AMAZON',
      orderDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      internalStatus: 'CONFIRMED',
      marketplaceStatus: 'Unshipped',
      customer: {
        name: 'Aarav Patel',
        email: 'aarav.patel@gmail.com',
        phone: '+91 98201 12345',
      },
      shippingAddress: {
        street: 'Flat 6B, Prestige Acropolis, Koramangala 3rd Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560034',
        country: 'India',
        phone: '+91 98201 12345',
      },
      items: [
        {
          id: 'item-101',
          sku: 'AUD-BT-099-BLK',
          name: 'Noise-Cancelling Wireless Over-Ear Headphones (Midnight Black)',
          quantity: 1,
          unitPrice: 3499,
          totalPrice: 3499,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 3499,
      tax: 629.82,
      shippingCost: 0,
      discount: 0,
      totalAmount: 3499,
      paymentStatus: 'PAID',
      paymentMethod: 'Prepaid (Amazon Pay UPI)',
      shippingStatus: 'LABEL_CREATED',
      courierPartner: 'Amazon Shipping (ATS)',
      trackingNumber: 'ATS982348192IN',
      rawEmailSubject: 'Order notification: 404-9823412-1928374',
      rawEmailSnippet: 'An order has been placed for Wireless Over-Ear Headphones by Aarav Patel. Ship To: Bengaluru...',
      timeline: [
        {
          id: 'tl-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          title: 'Order Ingested from Gmail',
          description: 'Detected from order-update@amazon.in via Amazon Parser v2.4',
          source: 'GMAIL_EMAIL',
        },
        {
          id: 'tl-2',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          title: 'Order Confirmed',
          description: 'Inventory reserved automatically for SKU AUD-BT-099-BLK',
          source: 'SYSTEM_CRON',
        }
      ],
      notes: [
        {
          id: 'nt-1',
          author: 'Priya Sharma',
          authorRole: 'ORDER_MANAGER',
          createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          content: 'Confirmed gift packaging requested by customer.',
        }
      ],
      isManualCorrection: false,
      unknownFields: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: 'ord-102',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1002',
      marketplaceOrderId: 'OD129481928471928341',
      marketplace: 'FLIPKART',
      orderDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      internalStatus: 'PROCESSING',
      marketplaceStatus: 'Approved - Pending Picklist',
      customer: {
        name: 'Neha Kapoor',
        email: 'neha.k@outlook.com',
        phone: '+91 99002 99881',
      },
      shippingAddress: {
        street: 'Tower 4, Apt 1102, DLF Phase 5, Golf Course Road',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        country: 'India',
      },
      items: [
        {
          id: 'item-102',
          sku: 'CUSH-LUMB-MESH-GRY',
          name: 'Ergonomic Orthopedic Lumbar Support Cushion (Air Mesh Grey)',
          quantity: 2,
          unitPrice: 899,
          totalPrice: 1798,
          image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 1798,
      tax: 323.64,
      shippingCost: 0,
      discount: 0,
      totalAmount: 1798,
      paymentStatus: 'PAID',
      paymentMethod: 'Prepaid (Flipkart Gateway)',
      shippingStatus: 'UNFULFILLED',
      courierPartner: 'Ekart Logistics',
      rawEmailSubject: 'Action Required: You have a new order OD129481928471928341',
      rawEmailSnippet: 'Order OD129481928471928341 placed. Dispatch SLA: 20 Nov 2026. Deliver to Gurugram...',
      timeline: [
        {
          id: 'tl-102',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          title: 'Email Order Detected',
          description: 'Flipkart Seller Hub notification parsed successfully',
          source: 'GMAIL_EMAIL',
        }
      ],
      notes: [],
      isManualCorrection: false,
      unknownFields: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'ord-103',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1003',
      marketplaceOrderId: 's-4928174129',
      marketplace: 'MEESHO',
      orderDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      internalStatus: 'PACKED',
      marketplaceStatus: 'Ready for Handover',
      customer: {
        name: 'Amit Verma',
        phone: '+91 97110 99887',
      },
      shippingAddress: {
        street: 'House No 74, Sector 15, Vasundhara',
        city: 'Ghaziabad',
        state: 'Uttar Pradesh',
        postalCode: '201012',
        country: 'India',
      },
      items: [
        {
          id: 'item-103',
          sku: 'MSH-SHIRT-NVY-L',
          name: "Men's Regular Fit Cotton Blend Casual Shirt (Navy Blue, Size L)",
          quantity: 1,
          unitPrice: 449,
          totalPrice: 449,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 449,
      tax: 22.45,
      shippingCost: 0,
      discount: 0,
      totalAmount: 449,
      paymentStatus: 'COD',
      paymentMethod: 'Cash on Delivery (COD)',
      shippingStatus: 'LABEL_CREATED',
      courierPartner: 'Shadowfax Express',
      trackingNumber: 'SFX-9948201948',
      rawEmailSubject: 'New Order Received! Sub-Order ID s-4928174129',
      timeline: [
        {
          id: 'tl-103-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          title: 'Order Ingested',
          description: 'Parsed from Meesho Supplier email notification',
          source: 'GMAIL_EMAIL',
        },
        {
          id: 'tl-103-2',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          title: 'Packed & Barcode Scanned',
          description: 'Box #B-19 tagged by warehouse scanner',
          source: 'MANUAL_STAFF',
          actor: 'Rahul (Warehouse Staff)',
        }
      ],
      notes: [],
      isManualCorrection: false,
      unknownFields: ['customer.email'],
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'ord-104',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1004',
      marketplaceOrderId: '#1042',
      marketplace: 'SHOPIFY',
      orderDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      internalStatus: 'SHIPPED',
      marketplaceStatus: 'Fulfilled',
      customer: {
        name: 'Sunita Rao',
        email: 'sunita.rao@example.com',
        phone: '+91 98111 55667',
      },
      shippingAddress: {
        street: 'Villa 14, Palm Meadows, Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560066',
        country: 'India',
      },
      items: [
        {
          id: 'item-104',
          sku: 'TEA-MATCHA-100G',
          name: 'Premium Organic Ceremonial Grade Matcha Green Tea Powder (100g)',
          quantity: 1,
          unitPrice: 1299,
          totalPrice: 1299,
          image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 1299,
      tax: 233.82,
      shippingCost: 0,
      discount: 0,
      totalAmount: 1299,
      paymentStatus: 'PAID',
      paymentMethod: 'Razorpay (Credit Card)',
      shippingStatus: 'IN_TRANSIT',
      courierPartner: 'Delhivery Surface',
      trackingNumber: 'DLV8839201940',
      rawEmailSubject: '[Apex Brand Store] Order #1042 placed by Sunita Rao',
      timeline: [
        {
          id: 'tl-104-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          title: 'Shopify Webhook Ingested',
          description: 'Instant notification via Shopify API',
          source: 'MARKETPLACE_API',
        },
        {
          id: 'tl-104-2',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          title: 'Handed to Courier',
          description: 'Delhivery courier pickup scanned at Central Warehouse Hub',
          source: 'SYSTEM_CRON',
        }
      ],
      notes: [],
      isManualCorrection: false,
      unknownFields: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: 'ord-105',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1005',
      marketplaceOrderId: 'MYN-83920194',
      marketplace: 'MYNTRA',
      orderDate: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      internalStatus: 'DELIVERED',
      marketplaceStatus: 'Delivered to Customer',
      customer: {
        name: 'Gaurav Mehra',
        email: 'gaurav.m@gmail.com',
        phone: '+91 98333 44556',
      },
      shippingAddress: {
        street: 'E-24, South Extension Part II',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110049',
        country: 'India',
      },
      items: [
        {
          id: 'item-105',
          sku: 'BLAZ-CHAR-40R',
          name: 'Men Slim Fit Italian Linen Blazer - Charcoal Grey (Size 40R)',
          quantity: 1,
          unitPrice: 4999,
          totalPrice: 4999,
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 4999,
      tax: 599.88,
      shippingCost: 0,
      discount: 0,
      totalAmount: 4999,
      paymentStatus: 'PAID',
      paymentMethod: 'Myntra Prepaid (UPI)',
      shippingStatus: 'DELIVERED',
      courierPartner: 'Myntra Logistics',
      trackingNumber: 'MYN-TRK-7719284',
      rawEmailSubject: 'Myntra Omnichannel Order Alert: MYN-83920194',
      timeline: [
        {
          id: 'tl-105-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          title: 'Order Ingested',
          description: 'Detected from sellercare@myntra.com',
          source: 'GMAIL_EMAIL',
        },
        {
          id: 'tl-105-2',
          timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
          title: 'Delivered',
          description: 'Delivered with OTP verification',
          source: 'SYSTEM_CRON',
        }
      ],
      notes: [],
      isManualCorrection: false,
      unknownFields: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
    {
      id: 'ord-106',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1006',
      marketplaceOrderId: '408-7294821-9284729',
      marketplace: 'AMAZON',
      orderDate: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      internalStatus: 'CANCELLED',
      marketplaceStatus: 'Cancelled by Buyer',
      customer: {
        name: 'Rajesh K. Sharma',
        phone: '+91 98200 44556',
      },
      shippingAddress: {
        street: 'Flat 402, Lotus Grand Residency, Malad West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400064',
        country: 'India',
      },
      items: [
        {
          id: 'item-106',
          sku: 'AUD-BT-099-BLK',
          name: 'Wireless Noise-Cancelling Over-Ear Headphones (Midnight Black)',
          quantity: 1,
          unitPrice: 3499,
          totalPrice: 3499,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 3499,
      tax: 629.82,
      shippingCost: 0,
      discount: 0,
      totalAmount: 3499,
      paymentStatus: 'REFUNDED',
      paymentMethod: 'Amazon Pay (Refunded)',
      shippingStatus: 'UNFULFILLED',
      courierPartner: 'Amazon Shipping (ATS)',
      rawEmailSubject: 'Order cancellation notification: 408-7294821-9284729',
      timeline: [
        {
          id: 'tl-106-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          title: 'Order Ingested',
          description: 'Original order email parsed',
          source: 'GMAIL_EMAIL',
        },
        {
          id: 'tl-106-2',
          timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
          title: 'Cancellation Email Detected',
          description: 'Gmail scanner detected cancellation notice from order-update@amazon.in. Order auto-cancelled and reserved stock released.',
          source: 'GMAIL_EMAIL',
        }
      ],
      notes: [
        {
          id: 'nt-106',
          author: 'System Bot',
          authorRole: 'ADMIN',
          createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
          content: 'Released 1 unit of AUD-BT-099-BLK back to available inventory.',
        }
      ],
      isManualCorrection: false,
      unknownFields: ['customer.email'],
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    },
    {
      id: 'ord-107',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1007',
      marketplaceOrderId: 'WOO-1852',
      marketplace: 'WOOCOMMERCE',
      orderDate: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
      internalStatus: 'CONFIRMED',
      marketplaceStatus: 'Processing',
      customer: {
        name: 'Vikram Singhania',
        email: 'vikram.s@company.co',
        phone: '+91 99881 22334',
      },
      shippingAddress: {
        street: 'Plot 88, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500033',
        country: 'India',
      },
      items: [
        {
          id: 'item-107',
          sku: 'TECH-CHRG-15W',
          name: 'Wireless Fast Charging Pad Qi Certified 15W',
          quantity: 1,
          unitPrice: 1599,
          totalPrice: 1599,
          image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 1599,
      tax: 287.82,
      shippingCost: 0,
      discount: 0,
      totalAmount: 1599,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI / Direct Bank Transfer',
      shippingStatus: 'UNFULFILLED',
      courierPartner: 'BlueDart Express',
      rawEmailSubject: '[My Store] New customer order (1852) - 19 November 2026',
      timeline: [
        {
          id: 'tl-107-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
          title: 'Order Parsed',
          description: 'WooCommerce transactional email parsed',
          source: 'GMAIL_EMAIL',
        }
      ],
      notes: [],
      isManualCorrection: false,
      unknownFields: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    },
    {
      id: 'ord-108',
      tenantId: 'company-apex-retail',
      orderNumber: 'OMS-1008',
      marketplaceOrderId: 'AJ-88291039',
      marketplace: 'AJIO',
      orderDate: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
      internalStatus: 'PROCESSING',
      marketplaceStatus: 'Order Manifest Generated',
      customer: {
        name: 'Ananya Deshmukh',
        email: 'ananya.d@gmail.com',
        phone: '+91 97666 11223',
      },
      shippingAddress: {
        street: 'Bungalow 7, Shivaji Park, Dadar West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400028',
        country: 'India',
      },
      items: [
        {
          id: 'item-108',
          sku: 'AJ-W-DRESS-RED',
          name: 'Floral Print Georgette Fit & Flare Maxi Dress',
          quantity: 1,
          unitPrice: 2199,
          totalPrice: 2199,
          image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=160&auto=format&fit=crop&q=80',
        }
      ],
      currency: 'INR',
      subtotal: 2199,
      tax: 263.88,
      shippingCost: 0,
      discount: 0,
      totalAmount: 2199,
      paymentStatus: 'PAID',
      paymentMethod: 'JioMoney / NetBanking',
      shippingStatus: 'UNFULFILLED',
      courierPartner: 'Reliance Logistics / Delhivery',
      rawEmailSubject: 'Order ID: AJ-88291039 Reliance Retail Order Notification',
      timeline: [
        {
          id: 'tl-108-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
          title: 'Order Ingested',
          description: 'AJIO Partner email parser matched',
          source: 'GMAIL_EMAIL',
        }
      ],
      notes: [],
      isManualCorrection: false,
      unknownFields: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    }
  ],
  inventory: [
    {
      id: 'inv-1',
      tenantId: 'company-apex-retail',
      sku: 'AUD-BT-099-BLK',
      name: 'Wireless Noise-Cancelling Over-Ear Headphones (Midnight Black)',
      barcode: '8901234567890',
      category: 'Electronics & Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&auto=format&fit=crop&q=80',
      costPrice: 1800,
      sellingPrice: 3499,
      availableStock: 24,
      reservedStock: 3,
      soldQuantity: 186,
      totalStock: 27,
      lowStockThreshold: 10,
      marketplaceAllocations: [
        { marketplace: 'AMAZON', stockAllocated: 12, salesCount: 112 },
        { marketplace: 'FLIPKART', stockAllocated: 8, salesCount: 54 },
        { marketplace: 'SHOPIFY', stockAllocated: 7, salesCount: 20 },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv-2',
      tenantId: 'company-apex-retail',
      sku: 'CUSH-LUMB-MESH-GRY',
      name: 'Ergonomic Orthopedic Lumbar Support Cushion (Air Mesh Grey)',
      barcode: '8901234567891',
      category: 'Home & Office',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=160&auto=format&fit=crop&q=80',
      costPrice: 420,
      sellingPrice: 899,
      availableStock: 6,
      reservedStock: 2,
      soldQuantity: 340,
      totalStock: 8,
      lowStockThreshold: 15,
      marketplaceAllocations: [
        { marketplace: 'FLIPKART', stockAllocated: 4, salesCount: 210 },
        { marketplace: 'AMAZON', stockAllocated: 2, salesCount: 95 },
        { marketplace: 'MEESHO', stockAllocated: 2, salesCount: 35 },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv-3',
      tenantId: 'company-apex-retail',
      sku: 'MSH-SHIRT-NVY-L',
      name: "Men's Regular Fit Cotton Blend Casual Shirt (Navy Blue, Size L)",
      barcode: '8901234567892',
      category: 'Fashion & Apparel',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&auto=format&fit=crop&q=80',
      costPrice: 220,
      sellingPrice: 449,
      availableStock: 48,
      reservedStock: 4,
      soldQuantity: 412,
      totalStock: 52,
      lowStockThreshold: 20,
      marketplaceAllocations: [
        { marketplace: 'MEESHO', stockAllocated: 30, salesCount: 310 },
        { marketplace: 'FLIPKART', stockAllocated: 12, salesCount: 78 },
        { marketplace: 'AJIO', stockAllocated: 10, salesCount: 24 },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv-4',
      tenantId: 'company-apex-retail',
      sku: 'TEA-MATCHA-100G',
      name: 'Premium Organic Ceremonial Grade Matcha Green Tea Powder (100g)',
      barcode: '8901234567893',
      category: 'Gourmet & Beverage',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=160&auto=format&fit=crop&q=80',
      costPrice: 650,
      sellingPrice: 1299,
      availableStock: 18,
      reservedStock: 1,
      soldQuantity: 128,
      totalStock: 19,
      lowStockThreshold: 10,
      marketplaceAllocations: [
        { marketplace: 'SHOPIFY', stockAllocated: 12, salesCount: 94 },
        { marketplace: 'AMAZON', stockAllocated: 7, salesCount: 34 },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv-5',
      tenantId: 'company-apex-retail',
      sku: 'BLAZ-CHAR-40R',
      name: 'Men Slim Fit Italian Linen Blazer - Charcoal Grey (Size 40R)',
      barcode: '8901234567894',
      category: 'Fashion & Apparel',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=160&auto=format&fit=crop&q=80',
      costPrice: 2400,
      sellingPrice: 4999,
      availableStock: 9,
      reservedStock: 1,
      soldQuantity: 74,
      totalStock: 10,
      lowStockThreshold: 8,
      marketplaceAllocations: [
        { marketplace: 'MYNTRA', stockAllocated: 6, salesCount: 52 },
        { marketplace: 'AJIO', stockAllocated: 4, salesCount: 22 },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'inv-6',
      tenantId: 'company-apex-retail',
      sku: 'TECH-CHRG-15W',
      name: 'Wireless Fast Charging Pad Qi Certified 15W',
      barcode: '8901234567895',
      category: 'Electronics & Audio',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=160&auto=format&fit=crop&q=80',
      costPrice: 720,
      sellingPrice: 1599,
      availableStock: 35,
      reservedStock: 2,
      soldQuantity: 142,
      totalStock: 37,
      lowStockThreshold: 15,
      marketplaceAllocations: [
        { marketplace: 'WOOCOMMERCE', stockAllocated: 15, salesCount: 42 },
        { marketplace: 'AMAZON', stockAllocated: 15, salesCount: 82 },
        { marketplace: 'SHOPIFY', stockAllocated: 7, salesCount: 18 },
      ],
      updatedAt: new Date().toISOString(),
    }
  ],
  emailLogs: [
    {
      id: 'log-1',
      tenantId: 'company-apex-retail',
      messageId: 'msg-amz-84920194',
      subject: 'Order notification: 404-9823412-1928374',
      from: 'order-update@amazon.in',
      date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      marketplaceDetected: 'AMAZON',
      emailType: 'ORDER_CONFIRMATION',
      status: 'SUCCESS',
      matchedRules: ['Amazon Seller Notification Engine v2.4'],
      extractedData: {
        marketplaceOrderId: '404-9823412-1928374',
        totalAmount: 3499,
      },
      missingFields: [],
      confidenceScore: 98,
      processedOrderId: 'ord-101',
      isRead: true,
      rawSnippet: 'Dear Seller, Congratulations! An order has been placed for Wireless Noise-Cancelling Over-Ear Headphones...',
    },
    {
      id: 'log-2',
      tenantId: 'company-apex-retail',
      messageId: 'msg-fk-12948192',
      subject: 'Action Required: You have a new order OD129481928471928341 to dispatch',
      from: 'seller-support@flipkart.com',
      date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      marketplaceDetected: 'FLIPKART',
      emailType: 'ORDER_CONFIRMATION',
      status: 'SUCCESS',
      matchedRules: ['Flipkart Seller Hub Rule Engine'],
      extractedData: {
        marketplaceOrderId: 'OD129481928471928341',
        totalAmount: 1798,
      },
      missingFields: [],
      confidenceScore: 96,
      processedOrderId: 'ord-102',
      isRead: true,
      rawSnippet: 'Dear Partner, A customer has just placed an order with your store on Flipkart! Order ID: OD129481928471928341...',
    },
    {
      id: 'log-3',
      tenantId: 'company-apex-retail',
      messageId: 'msg-msh-49281741',
      subject: 'New Order Received! Sub-Order ID s-4928174129',
      from: 'supplier-alerts@meesho.com',
      date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      marketplaceDetected: 'MEESHO',
      emailType: 'ORDER_CONFIRMATION',
      status: 'PARTIAL',
      matchedRules: ['Meesho Supplier Parsing Engine v1.8'],
      extractedData: {
        marketplaceOrderId: 's-4928174129',
        totalAmount: 449,
      },
      missingFields: ['customer.email'],
      confidenceScore: 92,
      processedOrderId: 'ord-103',
      isRead: false,
      rawSnippet: 'Hello Seller, Great news! You have received a new customer order on Meesho Supplier Panel. Sub-Order ID: s-4928174129...',
    },
    {
      id: 'log-4',
      tenantId: 'company-apex-retail',
      messageId: 'msg-amz-dup-9923',
      subject: 'Order notification: 404-9823412-1928374 (Copy)',
      from: 'order-update@amazon.in',
      date: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      marketplaceDetected: 'AMAZON',
      emailType: 'ORDER_CONFIRMATION',
      status: 'DUPLICATE_SKIPPED',
      matchedRules: ['Duplicate Order Fingerprint Preventer'],
      extractedData: {
        marketplaceOrderId: '404-9823412-1928374',
      },
      missingFields: [],
      confidenceScore: 100,
      isRead: true,
      rawSnippet: 'Identical confirmation received. Skipped ingestion to protect inventory and order records.',
    }
  ],
  teamMembers: [
    {
      id: 'usr-1',
      tenantId: 'company-apex-retail',
      name: 'Aditya Singhania',
      email: 'aditya@apexretail.io',
      role: 'SUPER_ADMIN',
      department: 'Executive Management',
      status: 'ACTIVE',
      lastActive: 'Just now',
    },
    {
      id: 'usr-2',
      tenantId: 'company-apex-retail',
      name: 'Priya Sharma',
      email: 'priya.s@apexretail.io',
      role: 'ORDER_MANAGER',
      department: 'Operations',
      status: 'ACTIVE',
      lastActive: '12m ago',
      assignedMarketplaces: ['AMAZON', 'FLIPKART', 'SHOPIFY'],
    },
    {
      id: 'usr-3',
      tenantId: 'company-apex-retail',
      name: 'Rahul Deshmukh',
      email: 'rahul.d@apexretail.io',
      role: 'WAREHOUSE_STAFF',
      department: 'Fulfillment & Logistics',
      status: 'ACTIVE',
      lastActive: '25m ago',
      assignedMarketplaces: ['MEESHO', 'MYNTRA', 'AJIO'],
    },
    {
      id: 'usr-4',
      tenantId: 'company-apex-retail',
      name: 'Kavita Menon',
      email: 'kavita.m@apexretail.io',
      role: 'ADMIN',
      department: 'Finance & Systems',
      status: 'ACTIVE',
      lastActive: '1h ago',
    },
    {
      id: 'usr-5',
      tenantId: 'company-apex-retail',
      name: 'Arjun Sen',
      email: 'arjun.sen@apexretail.io',
      role: 'VIEWER',
      department: 'Investor Relations',
      status: 'ACTIVE',
      lastActive: '3d ago',
    }
  ],
  activityLogs: [
    {
      id: 'act-1',
      tenantId: 'company-apex-retail',
      userId: 'usr-2',
      userName: 'Priya Sharma',
      userRole: 'ORDER_MANAGER',
      action: 'UPDATE_ORDER_NOTE',
      entityType: 'ORDER',
      entityId: 'ord-101',
      description: 'Added internal note: Confirmed gift packaging requested by customer.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: 'act-2',
      tenantId: 'company-apex-retail',
      userId: 'system',
      userName: 'Gmail Auto-Sync Engine',
      userRole: 'ADMIN',
      action: 'INGEST_GMAIL_ORDER',
      entityType: 'GMAIL',
      entityId: 'ord-101',
      description: 'Parsed Amazon order #404-9823412-1928374 from email notification',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'act-3',
      tenantId: 'company-apex-retail',
      userId: 'usr-3',
      userName: 'Rahul Deshmukh',
      userRole: 'WAREHOUSE_STAFF',
      action: 'PACK_ORDER',
      entityType: 'ORDER',
      entityId: 'ord-103',
      description: 'Marked order s-4928174129 as PACKED and scanned box barcode',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'act-4',
      tenantId: 'company-apex-retail',
      userId: 'usr-1',
      userName: 'Aditya Singhania',
      userRole: 'SUPER_ADMIN',
      action: 'SYNC_TRIGGER',
      entityType: 'GMAIL',
      entityId: 'sync-manual',
      description: 'Triggered manual Gmail sync scan across 7 marketplaces',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      tenantId: 'company-apex-retail',
      title: 'New Amazon Order Received',
      message: 'Order #404-9823412-1928374 (₹3,499) for Noise-Cancelling Headphones was ingested from Gmail.',
      type: 'NEW_ORDER',
      severity: 'low',
      read: false,
      link: '/orders',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'notif-2',
      tenantId: 'company-apex-retail',
      title: 'Low Stock Alert: Lumbar Support Cushion',
      message: 'Available stock for SKU CUSH-LUMB-MESH-GRY has dropped to 6 units (Threshold: 15).',
      type: 'LOW_STOCK',
      severity: 'high',
      read: false,
      link: '/inventory',
      createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    },
    {
      id: 'notif-3',
      tenantId: 'company-apex-retail',
      title: 'Order Cancelled by Buyer',
      message: 'Amazon order 408-7294821-9284729 was cancelled. Reserved stock released back to inventory.',
      type: 'CANCELLATION',
      severity: 'medium',
      read: true,
      link: '/orders',
      createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    },
    {
      id: 'notif-4',
      tenantId: 'company-apex-retail',
      title: 'Gmail Sync Complete',
      message: 'Auto-sync checked 14 recent emails. 1 new order ingested, 1 duplicate skipped.',
      type: 'INFO',
      severity: 'low',
      read: true,
      link: '/gmail-sync',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    }
  ]
};

// Ensure data folder exists
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_SEED_DATA, null, 2), 'utf-8');
  }
}

export function getDatabase(): DatabaseSchema {
  ensureStorage();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read db file, returning seed data:', err);
    return DEFAULT_SEED_DATA;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  ensureStorage();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Database Helper methods
export const db = {
  getOrders: (tenantId = 'company-apex-retail'): Order[] => {
    const data = getDatabase();
    return data.orders.filter(o => !tenantId || o.tenantId === tenantId);
  },

  getOrderById: (id: string, tenantId = 'company-apex-retail'): Order | undefined => {
    const data = getDatabase();
    return data.orders.find(o => o.id === id && (!tenantId || o.tenantId === tenantId));
  },

  createOrder: (order: Order): Order => {
    const data = getDatabase();
    data.orders.unshift(order);
    
    // Add activity log
    data.activityLogs.unshift({
      id: `act-${Date.now()}`,
      tenantId: order.tenantId,
      userId: 'system',
      userName: 'Order Engine',
      userRole: 'ADMIN',
      action: 'CREATE_ORDER',
      entityType: 'ORDER',
      entityId: order.id,
      description: `Created ${order.marketplace} order ${order.orderNumber} (${order.marketplaceOrderId})`,
      timestamp: new Date().toISOString(),
    });

    // Add in-app notification
    data.notifications.unshift({
      id: `notif-${Date.now()}`,
      tenantId: order.tenantId,
      title: `New ${order.marketplace} Order Received`,
      message: `Order #${order.marketplaceOrderId} for ${order.currency} ${order.totalAmount} has been registered.`,
      type: 'NEW_ORDER',
      severity: 'low',
      read: false,
      link: '/orders',
      createdAt: new Date().toISOString(),
    });

    saveDatabase(data);
    return order;
  },

  updateOrder: (id: string, updates: Partial<Order>, actor = 'Staff'): Order | null => {
    const data = getDatabase();
    const index = data.orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    const old = data.orders[index];
    const updated: Order = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If status changed, record timeline
    if (updates.internalStatus && updates.internalStatus !== old.internalStatus) {
      updated.timeline.unshift({
        id: `tl-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: `Internal Status Updated to ${updates.internalStatus}`,
        description: `Status changed by ${actor}. (Note: Marketplace order status requires authorized API writeback).`,
        source: 'MANUAL_STAFF',
        actor,
      });

      data.activityLogs.unshift({
        id: `act-${Date.now()}`,
        tenantId: updated.tenantId,
        userId: 'usr-current',
        userName: actor,
        userRole: 'ORDER_MANAGER',
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'ORDER',
        entityId: updated.id,
        description: `Updated status from ${old.internalStatus} to ${updates.internalStatus}`,
        timestamp: new Date().toISOString(),
      });
    }

    data.orders[index] = updated;
    saveDatabase(data);
    return updated;
  },

  addOrderNote: (orderId: string, content: string, author = 'Admin', role = 'ADMIN'): Order | null => {
    const data = getDatabase();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.notes.unshift({
      id: `note-${Date.now()}`,
      author,
      authorRole: role as any,
      createdAt: new Date().toISOString(),
      content,
    });

    data.activityLogs.unshift({
      id: `act-${Date.now()}`,
      tenantId: order.tenantId,
      userId: 'usr-current',
      userName: author,
      userRole: role as any,
      action: 'ADD_NOTE',
      entityType: 'ORDER',
      entityId: order.id,
      description: `Added internal note to order ${order.orderNumber}`,
      timestamp: new Date().toISOString(),
    });

    saveDatabase(data);
    return order;
  },

  getInventory: (tenantId = 'company-apex-retail'): InventoryItem[] => {
    const data = getDatabase();
    return data.inventory.filter(i => !tenantId || i.tenantId === tenantId);
  },

  adjustStock: (sku: string, delta: number, reason: string, actor = 'Inventory Manager'): InventoryItem | null => {
    const data = getDatabase();
    const item = data.inventory.find(i => i.sku === sku);
    if (!item) return null;

    item.availableStock = Math.max(0, item.availableStock + delta);
    item.totalStock = item.availableStock + item.reservedStock;
    item.updatedAt = new Date().toISOString();

    data.activityLogs.unshift({
      id: `act-${Date.now()}`,
      tenantId: item.tenantId,
      userId: 'usr-inventory',
      userName: actor,
      userRole: 'ADMIN',
      action: 'STOCK_ADJUSTMENT',
      entityType: 'INVENTORY',
      entityId: item.id,
      description: `Adjusted stock for ${sku} by ${delta > 0 ? `+${delta}` : delta} (${reason})`,
      timestamp: new Date().toISOString(),
    });

    if (item.availableStock <= item.lowStockThreshold) {
      data.notifications.unshift({
        id: `notif-${Date.now()}`,
        tenantId: item.tenantId,
        title: `Low Stock: ${item.name}`,
        message: `Available stock for ${item.sku} is down to ${item.availableStock} units!`,
        type: 'LOW_STOCK',
        severity: 'high',
        read: false,
        link: '/inventory',
        createdAt: new Date().toISOString(),
      });
    }

    saveDatabase(data);
    return item;
  },

  getGmailState: (): GmailConnectionState => {
    const data = getDatabase();
    return data.gmail;
  },

  updateGmailState: (updates: Partial<GmailConnectionState>): GmailConnectionState => {
    const data = getDatabase();
    data.gmail = { ...data.gmail, ...updates };
    saveDatabase(data);
    return data.gmail;
  },

  getEmailLogs: (): EmailLog[] => {
    const data = getDatabase();
    return data.emailLogs;
  },

  addEmailLog: (log: EmailLog): void => {
    const data = getDatabase();
    data.emailLogs.unshift(log);
    saveDatabase(data);
  },

  getMarketplaces: (): MarketplaceConfig[] => {
    const data = getDatabase();
    return data.marketplaces;
  },

  updateMarketplace: (id: string, updates: Partial<MarketplaceConfig>): MarketplaceConfig | null => {
    const data = getDatabase();
    const index = data.marketplaces.findIndex(m => m.id === id);
    if (index === -1) return null;
    data.marketplaces[index] = { ...data.marketplaces[index], ...updates };
    saveDatabase(data);
    return data.marketplaces[index];
  },

  getTeam: (): TeamMember[] => {
    const data = getDatabase();
    return data.teamMembers;
  },

  addTeamMember: (member: TeamMember): TeamMember => {
    const data = getDatabase();
    data.teamMembers.push(member);
    saveDatabase(data);
    return member;
  },

  getActivityLogs: (): ActivityLog[] => {
    const data = getDatabase();
    return data.activityLogs;
  },

  getNotifications: (): AppNotification[] => {
    const data = getDatabase();
    return data.notifications;
  },

  markNotificationRead: (id: string): void => {
    const data = getDatabase();
    const n = data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      saveDatabase(data);
    }
  },

  markAllNotificationsRead: (): void => {
    const data = getDatabase();
    data.notifications.forEach(n => { n.read = true; });
    saveDatabase(data);
  }
};
