import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, clientSecret, isDemo, email } = body;

    const current = db.getGmailState();
    const updated = db.updateGmailState({
      isConnected: true,
      isDemo: isDemo !== undefined ? isDemo : current.isDemo,
      connectedEmail: email || current.connectedEmail || 'authorized-seller@company.com',
      connectedAt: new Date().toISOString(),
      oauthConfig: {
        ...current.oauthConfig,
        clientId: clientId || current.oauthConfig.clientId,
        clientSecretSet: Boolean(clientSecret || current.oauthConfig.clientSecretSet),
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Google OAuth configuration updated successfully',
      state: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
