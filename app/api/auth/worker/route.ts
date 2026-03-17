import { NextRequest, NextResponse } from 'next/server';
import { registerWorker, verifyWorkerLogin } from '@/lib/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'register') {
      const result = await registerWorker({
        fullName: body.fullName,
        email: body.email,
        workerType: body.workerType,
        appointmentId: body.appointmentId,
        municipality: body.municipality,
        department: body.department,
        designation: body.designation,
        appointmentDocumentPath: body.documentPath,
        supervisorName: body.supervisorName,
        supervisorEmail: body.supervisorEmail,
        phoneNumber: body.phoneNumber,
      });

      return NextResponse.json(result);
    }

    if (action === 'login') {
      const result = await verifyWorkerLogin(body.email, body.appointmentId);
      
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
    console.error('[API] Worker auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
