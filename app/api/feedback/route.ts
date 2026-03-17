import { type NextRequest, NextResponse } from "next/server"
import { createFeedback, getAuditTrail, createAuditLog } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grievanceId = searchParams.get("grievanceId")

    if (!grievanceId) {
      return NextResponse.json(
        { success: false, error: "grievanceId is required" },
        { status: 400 }
      )
    }

    // Get audit trail for feedback history
    const auditTrail = await getAuditTrail(grievanceId)
    const feedbacks = auditTrail.filter((log) => log.action === "citizen_feedback")

    return NextResponse.json({
      success: true,
      data: feedbacks,
      count: feedbacks.length,
    })
  } catch (error) {
    console.error("[API] Error fetching feedback:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.grievanceId || body.rating === undefined || !body.comment) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (grievanceId, rating, comment)" },
        { status: 400 }
      )
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Create feedback record
    const feedback = await createFeedback({
      grievanceId: body.grievanceId,
      rating: body.rating,
      comment: body.comment,
      citizenEmail: body.citizenEmail,
    })

    // Also create an audit log for the feedback
    await createAuditLog({
      grievanceId: body.grievanceId,
      action: "citizen_feedback",
      actor: body.citizenEmail || "anonymous",
      details: `Rating: ${body.rating}/5 - ${body.comment}`,
    })

    return NextResponse.json(
      {
        success: true,
        data: feedback,
        message: "Feedback submitted successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Error submitting feedback:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit feedback",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
