"use client"

import { useParams } from "next/navigation"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const workOrdersData = [
  {
    id: 1,
    woNumber: "WO-2024-001",
    title: "Traffic Light Repair - Vijay Nagar Junction",
    module: "Traffic & Mobility",
    workType: "repair",
    priority: "high",
    status: "in_progress",
    assignedTo: "Arjun Sharma",
    department: "Transportation",
    location: "Vijay Nagar, Indore",
    estimatedHours: 4,
    actualHours: 2.5,
    estimatedCost: 18500,
    actualCost: 13500,
    createdAt: "2024-01-15",
    startedAt: "2024-01-16",
    description: "Traffic signal controller malfunction requires replacement and testing",
    notes: "Parts ordered, awaiting delivery",
  },
  {
    id: 2,
    woNumber: "WO-2024-002",
    title: "Water Pump Maintenance - Navlakha Station",
    module: "Energy & Utilities",
    workType: "maintenance",
    priority: "medium",
    status: "assigned",
    assignedTo: "Priya Verma",
    department: "Utilities",
    location: "Navlakha, Indore",
    estimatedHours: 8,
    actualHours: 0,
    estimatedCost: 52000,
    actualCost: 0,
    createdAt: "2024-01-16",
    description: "Routine maintenance and seal replacement",
    notes: "Scheduled for Monday morning",
  },
]

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  open: "bg-blue-100 text-blue-800",
  assigned: "bg-cyan-100 text-cyan-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function WorkOrderDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const workOrder = workOrdersData.find((wo) => wo.id === id)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!workOrder) {
    return (
      <>
        <AppHeader />
        <PageContainer title="Work Order Not Found">
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <p>The requested work order could not be found.</p>
            </CardContent>
          </Card>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <PageContainer title={workOrder.woNumber}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{workOrder.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{workOrder.module}</p>
                </div>
                <Badge className={statusColors[workOrder.status]}>{workOrder.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Priority</div>
                  <div className="font-semibold capitalize">{workOrder.priority}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Assigned To</div>
                  <div className="font-semibold">{workOrder.assignedTo || "Unassigned"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-semibold">{workOrder.department}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold">{workOrder.location}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{workOrder.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Time & Cost Tracking</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Hours</div>
                    <div className="font-semibold">{workOrder.estimatedHours}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Actual Hours</div>
                    <div className="font-semibold">{workOrder.actualHours}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Cost</div>
                    <div className="font-semibold">₹{workOrder.estimatedCost.toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Actual Cost</div>
                    <div className="font-semibold">₹{workOrder.actualCost.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{workOrder.notes}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsUpdating(true)}>Update Status</Button>
                <Button variant="outline">Close Work Order</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
