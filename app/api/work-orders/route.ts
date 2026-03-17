import { type NextRequest, NextResponse } from "next/server"
import {
  createWorkOrder,
  getWorkOrdersByVendor,
  updateWorkOrderStatus,
  getWorkOrdersOverdue,
  createAuditLog,
} from "@/lib/database"
import { sendWorkOrderAssignment, sendWorkOrderCompletion, sendOverdueWorkOrderAlert } from "@/lib/email-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    const overdue = searchParams.get("overdue")

    let workOrders
    if (vendorId) {
      workOrders = await getWorkOrdersByVendor(vendorId)
    } else if (overdue === "true") {
      workOrders = await getWorkOrdersOverdue()
    } else {
      return NextResponse.json(
        { success: false, error: "Please provide vendorId or use overdue=true parameter" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: workOrders,
      count: workOrders.length,
    })
  } catch (error) {
    console.error("[API] Error fetching work orders:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch work orders", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.vendorId || !body.location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create work order in database
    const newWorkOrder = await createWorkOrder({
      title: body.title,
      description: body.description,
      priority: body.priority || "medium",
      location: body.location,
      estimatedHours: body.estimatedHours || 8,
      estimatedCost: body.estimatedCost || 0,
      vendorId: body.vendorId,
      grievanceId: body.grievanceId,
      assignedBy: body.assignedBy || "admin",
    })

    // Create audit log
    await createAuditLog({
      workOrderId: newWorkOrder.id,
      grievanceId: body.grievanceId,
      action: "work_order_created",
      actor: body.assignedBy || "admin",
      details: `Work order created: ${body.title}`,
    })

    // Send assignment email to vendor
    if (body.workerEmail) {
      await sendWorkOrderAssignment(
        body.workerEmail,
        newWorkOrder.id,
        body.title,
        body.location,
        body.priority || "medium",
        newWorkOrder.due_date
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: newWorkOrder,
        message: "Work order created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Error creating work order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create work order",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { workOrderId, status, completionNotes, actualCost, citizenEmail, grievanceTitle } = body

    if (!workOrderId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing workOrderId or status" },
        { status: 400 }
      )
    }

    // Update work order status
    const updatedWorkOrder = await updateWorkOrderStatus(
      workOrderId,
      status,
      completionNotes,
      actualCost
    )

    // Create audit log
    await createAuditLog({
      workOrderId,
      action: "work_order_updated",
      actor: "worker",
      details: `Status updated to ${status}. ${completionNotes || ""}`,
    })

    // Send completion email if work order is completed
    if (status === "completed" && citizenEmail) {
      await sendWorkOrderCompletion(citizenEmail, workOrderId, grievanceTitle || "Issue")
    }

    return NextResponse.json({
      success: true,
      data: updatedWorkOrder,
      message: "Work order status updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating work order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update work order",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
