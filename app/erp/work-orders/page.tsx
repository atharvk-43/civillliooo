"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Plus, Filter, Clock, AlertTriangle } from "lucide-react"

// Mock work orders data
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
  },
  {
    id: 3,
    woNumber: "WO-2024-003",
    title: "Waste Collection Route Optimization",
    module: "Waste Management",
    workType: "inspection",
    priority: "low",
    status: "open",
    assignedTo: null,
    department: "Sanitation",
    location: "Azad Nagar, Indore",
    estimatedHours: 6,
    actualHours: 0,
    estimatedCost: 26000,
    actualCost: 0,
    createdAt: "2024-01-14",
  },
  {
    id: 4,
    woNumber: "WO-2024-004",
    title: "Emergency Pothole Repair",
    module: "City Management",
    workType: "repair",
    priority: "critical",
    status: "in_progress",
    assignedTo: "Rajesh Kumar",
    department: "Infrastructure",
    location: "Malviya Nagar, Indore",
    estimatedHours: 3,
    actualHours: 1.5,
    estimatedCost: 10850,
    actualCost: 7600,
    createdAt: "2024-01-16",
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

const priorityColors: Record<string, string> = {
  low: "text-blue-600",
  medium: "text-yellow-600",
  high: "text-orange-600",
  critical: "text-red-600",
}

export default function WorkOrdersPage() {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    department: "all",
  })

  const filteredOrders = workOrdersData.filter((order) => {
    if (filters.status !== "all" && order.status !== filters.status) return false
    if (filters.priority !== "all" && order.priority !== filters.priority) return false
    if (filters.department !== "all" && order.department !== filters.department) return false
    return true
  })

  const stats = {
    total: workOrdersData.length,
    inProgress: workOrdersData.filter((w) => w.status === "in_progress").length,
    open: workOrdersData.filter((w) => w.status === "open").length,
    critical: workOrdersData.filter((w) => w.priority === "critical").length,
  }

  return (
    <>
      <AppHeader />
      <PageContainer
        title="Work Orders & Task Management"
        description="Create, assign, and track operational tasks and maintenance work"
      >
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Work Orders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.open}</div>
                <div className="text-sm text-muted-foreground">Open / Unassigned</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.critical}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Critical Priority</div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <Link href="/erp/work-orders/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Work Order
              </Button>
            </Link>
          </div>

          {/* Work Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Link key={order.id} href={`/erp/work-orders/${order.id}`}>
                    <div className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {order.woNumber}: {order.title}
                            </h3>
                            {order.priority === "critical" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.module} • {order.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Assigned To</div>
                          <div className="font-medium">{order.assignedTo || "Unassigned"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Department</div>
                          <div className="font-medium">{order.department}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Priority</div>
                          <div className={`font-medium capitalize ${priorityColors[order.priority]}`}>
                            {order.priority}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Est. Hours</div>
                          <div className="font-medium">{order.estimatedHours}h</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Est. Cost</div>
                          <div className="font-medium">₹{order.estimatedCost.toLocaleString("en-IN")}</div>
                        </div>
                      </div>

                      {order.status === "in_progress" && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-blue-600">
                              <Clock className="w-4 h-4" />
                              {order.actualHours}h / {order.estimatedHours}h hours used
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
