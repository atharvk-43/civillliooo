import { type NextRequest, NextResponse } from "next/server"
import { createGrievance, getAllGrievances, getGrievancesByEmail, createAuditLog, updateGrievanceStatus } from "@/lib/database"
import { sendGrievanceConfirmation, sendGrievanceStatusUpdate } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let grievances
    if (email) {
      grievances = await getGrievancesByEmail(email)
    } else {
      grievances = await getAllGrievances(limit, offset)
    }

    return NextResponse.json({
      success: true,
      data: grievances,
      count: grievances.length,
    })
  } catch (error) {
    console.error("[API] Error fetching grievances:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch grievances", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.citizenName || !body.email || !body.category || !body.description || !body.location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create grievance in database
    const newGrievance = await createGrievance({
      citizenName: body.citizenName,
      email: body.email,
      phone: body.phone || "",
      category: body.category,
      title: body.title || body.category,
      description: body.description,
      location: body.location,
      priority: body.priority || "medium",
      attachments: body.attachments || [],
    })

    // Create audit log entry
    try {
      await createAuditLog({
        grievanceId: newGrievance.id,
        action: "grievance_created",
        actor: body.email,
        details: `Grievance submitted: ${body.description.substring(0, 100)}...`,
      })
    } catch (auditError) {
      console.warn("[API] Warning: Could not create audit log:", auditError)
    }

    // Send confirmation email
    try {
      await sendGrievanceConfirmation(
        body.email,
        newGrievance.id,
        body.title || body.category,
        body.category
      )
    } catch (emailError) {
      console.warn("[API] Warning: Could not send confirmation email:", emailError)
    }

    return NextResponse.json(
      {
        success: true,
        data: newGrievance,
        message: "Grievance submitted successfully.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Grievance submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit grievance",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { grievanceId, status, notes, email } = body

    if (!grievanceId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing grievanceId or status" },
        { status: 400 }
      )
    }

    // Update grievance status in database
    const updatedGrievance = await updateGrievanceStatus(grievanceId, status, notes)

    // Create audit log
    try {
      await createAuditLog({
        grievanceId,
        action: "status_updated",
        actor: "admin",
        details: `Status updated to ${status}. ${notes || ""}`,
      })
    } catch (auditError) {
      console.warn("[API] Warning: Could not create audit log:", auditError)
    }

    // Send status update email if email provided
    if (body.email) {
      try {
        await sendGrievanceStatusUpdate(body.email, grievanceId, status, notes || "")
      } catch (emailError) {
        console.warn("[API] Warning: Could not send status update email:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedGrievance,
      message: "Grievance status updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating grievance:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update grievance",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
