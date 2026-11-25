import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { InternalOrderStatus } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderIds = [], action, status, actor = 'Operations Staff' } = body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No order IDs provided' }, { status: 400 });
    }

    const updatedOrders = [];

    if (action === 'UPDATE_STATUS' && status) {
      for (const id of orderIds) {
        const res = db.updateOrder(id, { internalStatus: status as InternalOrderStatus }, actor);
        if (res) updatedOrders.push(res);
      }
    }

    return NextResponse.json({
      success: true,
      modifiedCount: updatedOrders.length,
      orders: updatedOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
