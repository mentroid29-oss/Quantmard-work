import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TeamMember, UserRole } from '@/types';

export async function GET() {
  const team = db.getTeam();
  const activityLogs = db.getActivityLogs().slice(0, 100);
  return NextResponse.json({ success: true, team, activityLogs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role = 'ORDER_MANAGER', department = 'Operations', assignedMarketplaces = [] } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      tenantId: 'company-apex-retail',
      name,
      email,
      role: role as UserRole,
      department,
      status: 'ACTIVE',
      lastActive: 'Just invited',
      assignedMarketplaces,
    };

    const saved = db.addTeamMember(newMember);
    return NextResponse.json({ success: true, member: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
