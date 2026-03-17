import { NextRequest, NextResponse } from 'next/server';
import { registerCitizen, verifyCitizenLogin } from '@/lib/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'register') {
      const result = await registerCitizen({
        fullName: body.fullName,
        email: body.email,
        identificationType: body.identificationType,
        identificationNumber: body.identificationNumber,
        locality: body.locality,
        phoneNumber: body.phoneNumber,
      });

      return NextResponse.json(result);
    }

    if (action === 'login') {
      const result = await verifyCitizenLogin(body.email, body.identificationNumber);
      
      if (result.success) {
        const response = NextResponse.json(result);
        response.cookies.set({
          name: 'sessionToken',
          value: result.data.sessionToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
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
    console.error('[API] Citizen auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
