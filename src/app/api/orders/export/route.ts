import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateOrdersCSV } from '@/lib/export/excel';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marketplace = searchParams.get('marketplace');
    const status = searchParams.get('status');

    let orders = db.getOrders();
    if (marketplace && marketplace !== 'ALL') {
      orders = orders.filter(o => o.marketplace === marketplace);
    }
    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.internalStatus === status);
    }

    const csvContent = generateOrdersCSV(orders);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="OMS_Orders_Export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderIds = [] } = body;

    let orders = db.getOrders();
    if (Array.isArray(orderIds) && orderIds.length > 0) {
      orders = orders.filter(o => orderIds.includes(o.id));
    }

    const csvContent = generateOrdersCSV(orders);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="OMS_Selected_Orders_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
