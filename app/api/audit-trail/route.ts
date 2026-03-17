import { type NextRequest, NextResponse } from "next/server"
import { getAuditTrail, createAuditLog } from "@/lib/database"

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

    const auditTrail = await getAuditTrail(grievanceId)

    return NextResponse.json({
      success: true,
      data: auditTrail,
      count: auditTrail.length,
    })
  } catch (error) {
    console.error("[API] Error fetching audit trail:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit trail", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.action || !body.actor) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (action, actor)" },
        { status: 400 }
      )
    }

    // Create audit log entry
    const auditEntry = await createAuditLog({
      grievanceId: body.grievanceId,
      workOrderId: body.workOrderId,
      action: body.action,
      actor: body.actor,
      details: body.details || "",
    })

    return NextResponse.json(
      {
        success: true,
        data: auditEntry,
        message: "Audit log created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Error creating audit log:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create audit log",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
