import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const notifications = db.getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  return NextResponse.json({ success: true, unreadCount, notifications });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, markAll = false } = body;

    if (markAll) {
      db.markAllNotificationsRead();
    } else if (id) {
      db.markNotificationRead(id);
    }

    return NextResponse.json({ success: true, notifications: db.getNotifications() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
