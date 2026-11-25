import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const inventory = db.getInventory();
  return NextResponse.json({ success: true, count: inventory.length, inventory });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, delta, reason = 'Manual Stock Adjustment', actor = 'Warehouse Staff' } = body;

    if (!sku || delta === undefined) {
      return NextResponse.json({ success: false, error: 'SKU and delta are required' }, { status: 400 });
    }

    const updated = db.adjustStock(sku, Number(delta), reason, actor);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'SKU not found in inventory' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
