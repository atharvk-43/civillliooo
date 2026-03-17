import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth-service'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'No session token' },
        { status: 401 }
      )
    }

    const validation = await validateSession(sessionToken)

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      userId: validation.userId,
      userType: validation.userType,
    })
  } catch (error) {
    console.error('[API] Session verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 }
    )
  }
}
