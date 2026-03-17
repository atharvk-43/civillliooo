import { NextRequest, NextResponse } from 'next/server';
import { registerLeader, verifyLeaderLogin } from '@/lib/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'register') {
      const result = await registerLeader({
        fullName: body.fullName,
        email: body.email,
        adminPosition: body.position,
        appointmentLetterNumber: body.appointmentLetterNumber,
        appointmentDate: body.appointmentDate,
        jurisdictionId: body.jurisdictionId,
        departmentId: body.departmentId,
        phoneNumber: body.phoneNumber,
      });

      return NextResponse.json(result);
    }

    if (action === 'login') {
      const result = await verifyLeaderLogin(body.email, body.appointmentLetterNumber);
      
      if (result.success) {
        const response = NextResponse.json(result);
        response.cookies.set({
          name: 'sessionToken',
          value: result.data.sessionToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
        });
        return response;
      }

      return NextResponse.json(result, { status: 401 });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API] Leader auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
