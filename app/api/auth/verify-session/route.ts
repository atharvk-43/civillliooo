import { NextRequest, NextResponse } from "next/server"
import { sessionStore } from "../universal/route"

interface VerifyRequest {
  sessionId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "No session ID provided" },
        { status: 401 }
      )
    }

    // Get session from store
    const session = sessionStore.get(sessionId)

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 401 }
      )
    }

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      sessionStore.delete(sessionId)
      return NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        userId: session.userId,
        name: session.name,
        email: session.email,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Session verification error:", error)
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 400 }
    )
  }
}
