import { NextRequest, NextResponse } from 'next/server';

// Using dynamic import to avoid circular dependencies
async function getSessionStore() {
  try {
    const { sessionStore } = await import('../universal/route');
    return sessionStore;
  } catch (error) {
    console.warn('[API] Could not import sessionStore');
    return new Map();
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('civilio-session')?.value;

    if (sessionId) {
      const sessionStore = await getSessionStore();
      sessionStore.delete(sessionId);
      console.log('[v0] User logged out, session deleted');
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear both session cookies
    response.cookies.delete('civilio-session');
    response.cookies.delete('civilio-user');
    response.cookies.set({
      name: 'sessionToken',
      value: '',
      httpOnly: true,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('[API] Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}
