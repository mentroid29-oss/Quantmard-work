import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const marketplaces = db.getMarketplaces();
  return NextResponse.json({ success: true, marketplaces });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Marketplace ID required' }, { status: 400 });
    }

    const updated = db.updateMarketplace(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Marketplace not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, marketplace: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
