export interface SampleEmailTemplate {
  id: string;
  name: string;
  marketplace: string;
  type: string;
  from: string;
  subject: string;
  body: string;
}

export const SAMPLE_EMAILS: SampleEmailTemplate[] = [
  {
    id: 'sample-amz-1',
    name: 'Amazon FBM Order Confirmation',
    marketplace: 'AMAZON',
    type: 'ORDER_CONFIRMATION',
    from: 'order-update@amazon.in',
    subject: 'Order notification: 408-7294821-9284729 (1 item)',
    body: `Dear Seller,

Congratulations! An order has been placed for the following item on Amazon.in:

Order ID: 408-7294821-9284729
Order Date: 19 Nov 2026 08:30 IST

Item Details:
Quantity: 1
Item: Wireless Noise-Cancelling Over-Ear Headphones (Midnight Black)
SKU: AUD-BT-099-BLK
Price: ₹3,499.00
Tax: ₹629.82
Shipping: ₹0.00
Grand Total: ₹3,499.00

Payment Method: Prepaid (Amazon Pay UPI)

Ship To:
Rajesh K. Sharma
Flat 402, Lotus Grand Residency,
Near Infinity IT Park, Malad West,
Mumbai, Maharashtra - 400064
India
Phone: +91 98200 44556

Please dispatch the item within 24 hours to maintain your seller performance metrics.

Thank you for selling on Amazon!
Amazon Seller Central Team`
  },
  {
    id: 'sample-fk-1',
    name: 'Flipkart Seller Hub Order Placed',
    marketplace: 'FLIPKART',
    type: 'ORDER_CONFIRMATION',
    from: 'seller-support@flipkart.com',
    subject: 'Action Required: You have a new order OD129481928471928341 to dispatch',
    body: `Dear Partner,

A customer has just placed an order with your store on Flipkart!

Order ID: OD129481928471928341
Order Dispatch SLA: 20 Nov 2026, 14:00 PM

Listing Title: Ergonomic Orthopedic Lumbar Support Cushion (Air Mesh)
FSN: CUSH938FKN2839
Seller SKU: CUSH-LUMB-MESH-GRY
Quantity: 2
Selling Price: ₹1,798.00 (₹899.00 each)
Invoice Amount: ₹1,798.00

Deliver to:
Pooja Venkatesh
#12, 4th Cross, Indiranagar 1st Stage,
Bengaluru, Karnataka - 560038
Mobile: +91 99002 11234

Courier Partner: Ekart Logistics
Payment Mode: Prepaid (Flipkart Gateway)

Please pack the product and mark "Ready for Dispatch" before SLA expiry.
Regards,
Flipkart Seller Operations`
  },
  {
    id: 'sample-msh-1',
    name: 'Meesho Supplier Panel Order Alert',
    marketplace: 'MEESHO',
    type: 'ORDER_CONFIRMATION',
    from: 'supplier-alerts@meesho.com',
    subject: 'New Order Received! Sub-Order ID s-4928174129',
    body: `Hello Seller,

Great news! You have received a new customer order on Meesho Supplier Panel.

Sub-Order ID: s-4928174129
Product Title: Men's Regular Fit Cotton Blend Casual Shirt (Navy Blue, Size L)
Product SKU: MSH-SHIRT-NVY-L
Quantity: 1
Supplier Settlement: ₹449.00
Customer Price: ₹499.00

Buyer Name: Amit Verma
Delivery Address:
House No 74, Sector 15, Vasundhara,
Ghaziabad, Uttar Pradesh - 201012
Phone: +91 97110 99887

Payment Method: Cash on Delivery (COD)
Assigned Logistics: Shadowfax Express

Please download shipping label and pack the shipment before 6 PM today.
Team Meesho`
  },
  {
    id: 'sample-shp-1',
    name: 'Shopify Store Customer Order #1042',
    marketplace: 'SHOPIFY',
    type: 'ORDER_CONFIRMATION',
    from: 'mailer@shopify.com',
    subject: '[Store Name] Order #1042 placed by Sunita Rao',
    body: `You have received a new order!

Order #1042
Placed on Nov 19, 2026 at 07:45 AM

Customer: Sunita Rao (sunita.rao@example.com)

Items Ordered:
1x Premium Organic Matcha Green Tea Powder (100g)
SKU: TEA-MATCHA-100G
Total: ₹1,299.00

Shipping Address:
Sunita Rao
Villa 14, Palm Meadows, Whitefield,
Bengaluru, Karnataka - 560066
India

Payment Method: Razorpay (Credit Card Ending in 4242)
Status: Paid
Delivery Option: Express Shipping (Delhivery Air)

View order in Shopify Admin: https://mystore.myshopify.com/admin/orders/1042`
  },
  {
    id: 'sample-amz-cancel',
    name: 'Amazon Order Cancellation Notice',
    marketplace: 'AMAZON',
    type: 'CANCELLATION',
    from: 'order-update@amazon.in',
    subject: 'Order cancellation notification: 408-7294821-9284729',
    body: `Dear Seller,

The buyer has requested to cancel order 408-7294821-9284729.

Order ID: 408-7294821-9284729
Reason: Buyer placed order by mistake
Status: Cancelled

Please do not dispatch this order. No further action is required from you for this order.

Amazon Seller Support`
  },
  {
    id: 'sample-fk-return',
    name: 'Flipkart Customer Return Request',
    marketplace: 'FLIPKART',
    type: 'RETURN_REQUEST',
    from: 'seller-support@flipkart.com',
    subject: 'Customer return initiated for Order OD129481928471928341',
    body: `Dear Partner,

A customer return request has been authorized for Order ID: OD129481928471928341.

Product: Ergonomic Orthopedic Lumbar Support Cushion
Seller SKU: CUSH-LUMB-MESH-GRY
Reason for Return: Size/Fit expectation not met
Return Tracking ID: FMPR00293849182
Return Status: In-Transit back to Seller Warehouse

The courier executive from Ekart will hand over the packet upon delivery.
Flipkart Logistics Team`
  },
  {
    id: 'sample-woo-1',
    name: 'WooCommerce New Order #1852',
    marketplace: 'WOOCOMMERCE',
    type: 'ORDER_CONFIRMATION',
    from: 'sales@mystore-wordpress.com',
    subject: '[My Store] New customer order (1852) - 19 November 2026',
    body: `You’ve received the following order from Vikram Singhania:

[Order #1852] (19 November 2026)

Product: Wireless Fast Charging Pad 15W
SKU: TECH-CHRG-15W
Quantity: 1
Price: ₹1,599.00
Payment method: Direct UPI / Card
Total: ₹1,599.00

Billing address:
Vikram Singhania
Plot 88, Jubilee Hills,
Hyderabad, Telangana 500033
Email: vikram.s@company.co
Tel: +91 99881 22334`
  },
  {
    id: 'sample-myn-1',
    name: 'Myntra Omnichannel Dispatch Order',
    marketplace: 'MYNTRA',
    type: 'ORDER_CONFIRMATION',
    from: 'sellercare@myntra.com',
    subject: 'Myntra Omnichannel Order Alert: MYN-83920194',
    body: `Dear Brand Partner,

A new omnichannel order is ready for packaging at your store:

Order ID: MYN-83920194
Style ID: MYN-STY-99482
Product: Slim Fit Linen Blazer - Charcoal
SKU: BLAZ-CHAR-40R
Quantity: 1
Order Value: ₹4,999.00
Delivery SLA: Same Day 6:00 PM

Customer Delivery Location:
South Extension Part II, New Delhi - 110049
Customer: Gaurav Mehra

Logistics: Myntra Express Pickup`
  }
];
