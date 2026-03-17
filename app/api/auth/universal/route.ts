import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

interface UniversalAuthRequest {
  name?: string
  email?: string
  credential?: string
}

interface SessionData {
  sessionId: string
  userId: string
  name: string
  email: string
  credential: string
  loginTime: number
  expiresAt: number
  ipAddress: string
  userAgent: string
}

// In-memory session store (in production, use database)
const sessionStore = new Map<string, SessionData>()

// Helper function to generate secure token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Helper function to hash credential (for audit logging)
function hashCredential(credential: string): string {
  return crypto.createHash("sha256").update(credential).digest("hex").substring(0, 16)
}

// Helper function to sanitize input
function sanitizeInput(input: string): string {
  return input.trim().slice(0, 255)
}

export async function POST(request: NextRequest) {
  try {
    const body: UniversalAuthRequest = await request.json()

    // Sanitize inputs
    const name = sanitizeInput(body.name || "Anonymous User")
    const email = sanitizeInput(body.email || `user-${Date.now()}@civilio.local`)
    const credential = sanitizeInput(body.credential || "DEFAULT_CREDENTIAL")

    // Generate session
    const sessionId = generateSessionToken()
    const userId = crypto.randomUUID()
    const now = Date.now()
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000 // 7 days

    // Get client IP
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create session
    const session: SessionData = {
      sessionId,
      userId,
      name,
      email,
      credential: hashCredential(credential),
      loginTime: now,
      expiresAt,
      ipAddress,
      userAgent,
    }

    // Store session
    sessionStore.set(sessionId, session)

    // Log authentication (audit trail)
    console.log("[v0] Universal Auth - User logged in", {
      userId,
      email,
      name,
      ipAddress,
      timestamp: new Date(now).toISOString(),
    })

    // Create response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Authentication successful",
        userId,
        sessionId,
      },
      { status: 200 }
    )

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: "civilio-session",
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    // Set user info cookie (non-sensitive)
    response.cookies.set({
      name: "civilio-user",
      value: JSON.stringify({ userId, name, email }),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Universal Auth Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed. Please try again.",
      },
      { status: 400 }
    )
  }
}

// Export session store for other endpoints to use
export { sessionStore, SessionData }
