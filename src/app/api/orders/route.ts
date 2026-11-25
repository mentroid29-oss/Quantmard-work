import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Order } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const marketplace = searchParams.get('marketplace');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const shippingStatus = searchParams.get('shippingStatus');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let orders = db.getOrders();

    // Filters
    if (marketplace && marketplace !== 'ALL') {
      orders = orders.filter(o => o.marketplace === marketplace);
    }
    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.internalStatus === status);
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      orders = orders.filter(o => o.paymentStatus === paymentStatus);
    }
    if (shippingStatus && shippingStatus !== 'ALL') {
      orders = orders.filter(o => o.shippingStatus === shippingStatus);
    }

    // Search
    if (search) {
      orders = orders.filter(o => 
        o.orderNumber.toLowerCase().includes(search) ||
        o.marketplaceOrderId.toLowerCase().includes(search) ||
        o.customer?.name?.toLowerCase().includes(search) ||
        o.customer?.phone?.includes(search) ||
        o.items.some(i => i.name.toLowerCase().includes(search) || i.sku.toLowerCase().includes(search))
      );
    }

    // Sort
    orders.sort((a, b) => {
      if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
      }
      // default: date
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tenantId: 'company-apex-retail',
      orderNumber: `OMS-${Math.floor(1000 + Math.random() * 9000)}`,
      marketplaceOrderId: body.marketplaceOrderId || `MAN-${Date.now().toString().slice(-6)}`,
      marketplace: body.marketplace || 'CUSTOM',
      orderDate: body.orderDate || new Date().toISOString(),
      internalStatus: body.internalStatus || 'CONFIRMED',
      marketplaceStatus: body.marketplaceStatus || 'Manual Entry',
      customer: body.customer || { name: 'Direct Customer' },
      shippingAddress: body.shippingAddress || {
        street: 'Direct Dispatch',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
      items: body.items || [{
        id: `item-${Date.now()}`,
        sku: 'CUSTOM-SKU-1',
        name: 'Manual Order Product',
        quantity: 1,
        unitPrice: body.totalAmount || 1000,
        totalPrice: body.totalAmount || 1000,
      }],
      currency: 'INR',
      subtotal: body.totalAmount || 1000,
      tax: Number(((body.totalAmount || 1000) * 0.18).toFixed(2)),
      shippingCost: 0,
      discount: 0,
      totalAmount: body.totalAmount || 1000,
      paymentStatus: body.paymentStatus || 'PAID',
      paymentMethod: body.paymentMethod || 'Manual Record',
      shippingStatus: 'UNFULFILLED',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Order Created Manually',
          description: 'Created by staff in OMS',
          source: 'MANUAL_STAFF',
          actor: body.actor || 'Admin',
        }
      ],
      notes: [],
      isManualCorrection: false,
      unknownFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.createOrder(newOrder);
    return NextResponse.json({ success: true, order: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
