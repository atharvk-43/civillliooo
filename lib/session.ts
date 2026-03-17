import { cookies } from 'next/headers'

export interface SessionData {
  userId: string
  userType: 'citizen' | 'leader' | 'worker'
  email: string
  fullName: string
  verificationStatus: 'pending' | 'verified'
  expiresAt: number
}

export async function getSessionFromCookies(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('sessionToken')?.value
    
    if (!sessionToken) {
      return null
    }

    // Verify session with backend
    const response = await fetch('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.session || null
  } catch (error) {
    console.error('[v0] Session verification error:', error)
    return null
  }
}

export async function createSessionCookie(sessionData: SessionData) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'sessionToken',
    value: sessionData.userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('sessionToken')
}
