import { NextRequest, NextResponse } from 'next/server';
import { parseOrderEmail } from '@/lib/parsers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject = '', from = '', body: emailBody = '' } = body;

    if (!subject && !emailBody) {
      return NextResponse.json({ success: false, error: 'Email subject or body is required' }, { status: 400 });
    }

    const result = parseOrderEmail({
      subject,
      from,
      body: emailBody,
    });

    return NextResponse.json({
      success: true,
      parseResult: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
