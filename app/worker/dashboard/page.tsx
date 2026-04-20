"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, LogOut } from "lucide-react"

interface WorkOrder {
  id: number
  wo_number: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "draft" | "open" | "assigned" | "in_progress" | "completed" | "cancelled"
  location_description: string
  estimated_hours: number
  estimated_cost: number
  created_at: string
  created_by: string
}

export default function WorkerDashboard() {
  const { role, isLoading, logout } = useUser()
  const router = useRouter()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [selectedTab, setSelectedTab] = useState("assigned")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && role !== "worker") {
      router.push("/login")
      return
    }
    if (!isLoading && role === "worker") {
      fetchWorkOrders()
    }
  }, [role, isLoading, router])

  const fetchWorkOrders = async () => {
    // Mock data - replace with actual API call
    const mockOrders: WorkOrder[] = [
      {
        id: 1,
        wo_number: "WO-2024-001",
        title: "Pothole Repair - Main Street",
        description: "Repair large pothole causing traffic hazards on Main Street near downtown",
        priority: "high",
        status: "assigned",
        location_description: "Main Street, Downtown Zone, Indore",
        estimated_hours: 8,
        estimated_cost: 5000,
        created_at: "2024-01-20",
        created_by: "Citizen Leader - Rajesh Kumar",
      },
      {
        id: 2,
        wo_number: "WO-2024-002",
        title: "Street Light Installation",
        description: "Install new LED street lights in Vijay Nagar residential area",
        priority: "medium",
        status: "assigned",
        location_description: "Vijay Nagar, Indore",
        estimated_hours: 12,
        estimated_cost: 15000,
        created_at: "2024-01-19",
        created_by: "Citizen Leader - Priya Singh",
      },
      {
        id: 3,
        wo_number: "WO-2024-003",
        title: "Drainage Cleaning",
        description: "Clear blocked drainage system causing water accumulation",
        priority: "critical",
        status: "assigned",
        location_description: "Navlakha, Indore",
        estimated_hours: 6,
        estimated_cost: 3000,
        created_at: "2024-01-18",
        created_by: "Citizen Leader - Amit Patel",
      },
      {
        id: 4,
        wo_number: "WO-2024-004",
        title: "Waste Collection System Upgrade",
        description: "Upgrade and replace old waste collection bins",
        priority: "medium",
        status: "in_progress",
        location_description: "Super Corridor, Indore",
        estimated_hours: 16,
        estimated_cost: 20000,
        created_at: "2024-01-15",
        created_by: "Citizen Leader - Vikram Sharma",
      },
      {
        id: 5,
        wo_number: "WO-2024-005",
        title: "Water Quality Testing",
        description: "Conduct comprehensive water quality testing in residential areas",
        priority: "medium",
        status: "completed",
        location_description: "Multiple zones - Indore",
        estimated_hours: 10,
        estimated_cost: 8000,
        created_at: "2024-01-10",
        created_by: "Citizen Leader - Neha Gupta",
      },
    ]
    setWorkOrders(mockOrders)
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleUpdateStatus = (woId: number, newStatus: WorkOrder["status"]) => {
    setWorkOrders((prev) =>
      prev.map((order) => (order.id === woId ? { ...order, status: newStatus } : order))
    )
  }

  const getStatusColor = (status: WorkOrder["status"]) => {
    const statusColors: Record<WorkOrder["status"], string> = {
      draft: "bg-gray-100 text-gray-800",
      open: "bg-blue-100 text-blue-800",
      assigned: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return statusColors[status]
  }

  const getPriorityColor = (priority: WorkOrder["priority"]) => {
    const priorityColors: Record<WorkOrder["priority"], string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }
    return priorityColors[priority]
  }

  const filteredOrders = workOrders.filter((order) => {
    if (selectedTab === "assigned") return order.status === "assigned"
    if (selectedTab === "in_progress") return order.status === "in_progress"
    if (selectedTab === "completed") return order.status === "completed"
    return true
  })

  const stats = {
    assigned: workOrders.filter((o) => o.status === "assigned").length,
    inProgress: workOrders.filter((o) => o.status === "in_progress").length,
    completed: workOrders.filter((o) => o.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Worker Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your assigned work orders and tasks</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Assigned Tasks</p>
                <p className="text-4xl font-bold text-foreground mt-2">{stats.assigned}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">In Progress</p>
                <p className="text-4xl font-bold text-foreground mt-2">{stats.inProgress}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-4xl font-bold text-foreground mt-2">{stats.completed}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Work Orders */}
        <Card className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assigned">
                Assigned <Badge className="ml-2">{stats.assigned}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                In Progress <Badge className="ml-2">{stats.inProgress}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed <Badge className="ml-2">{stats.completed}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="space-y-4 mt-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No assigned tasks at the moment</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <WorkOrderCard
                    key={order.id}
                    order={order}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="in_progress" className="space-y-4 mt-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tasks in progress</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <WorkOrderCard
                    key={order.id}
                    order={order}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No completed tasks</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <WorkOrderCard
                    key={order.id}
                    order={order}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Deadline Notice */}
        <Card className="p-6 mt-8 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900">Work Order Response Deadline</h3>
              <p className="text-orange-700 text-sm mt-1">
                All assigned work orders must be completed or reverted with a completion report within 7 days of
                assignment. Delayed submissions may impact your vendor rating.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function WorkOrderCard({
  order,
  getStatusColor,
  getPriorityColor,
  onUpdateStatus,
}: {
  order: WorkOrder
  getStatusColor: (status: WorkOrder["status"]) => string
  getPriorityColor: (priority: WorkOrder["priority"]) => string
  onUpdateStatus: (id: number, status: WorkOrder["status"]) => void
}) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-foreground">{order.title}</h3>
            <Badge className={getPriorityColor(order.priority)}>{order.priority.toUpperCase()}</Badge>
            <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{order.wo_number}</p>
        </div>
      </div>

      <p className="text-foreground mb-4">{order.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
          <p className="text-sm font-medium text-foreground mt-1">{order.location_description}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Est. Hours</p>
          <p className="text-sm font-medium text-foreground mt-1">{order.estimated_hours} hours</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Est. Cost</p>
          <p className="text-sm font-medium text-foreground mt-1">₹{order.estimated_cost.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Assigned By</p>
          <p className="text-sm font-medium text-foreground mt-1">{order.created_by}</p>
        </div>
      </div>

      <div className="flex gap-3">
        {order.status === "assigned" && (
          <>
            <Button
              onClick={() => onUpdateStatus(order.id, "in_progress")}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              Start Work
            </Button>
            <Button onClick={() => setShowActions(!showActions)} size="sm" variant="outline">
              More Actions
            </Button>
            {showActions && (
              <Button onClick={() => onUpdateStatus(order.id, "cancelled")} size="sm" variant="ghost">
                Cannot Complete
              </Button>
            )}
          </>
        )}

        {order.status === "in_progress" && (
          <>
            <Button
              onClick={() => onUpdateStatus(order.id, "completed")}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Mark Complete
            </Button>
            <Button onClick={() => setShowActions(!showActions)} size="sm" variant="outline">
              More Actions
            </Button>
            {showActions && (
              <Button onClick={() => onUpdateStatus(order.id, "assigned")} size="sm" variant="ghost">
                Reset to Assigned
              </Button>
            )}
          </>
        )}

        {order.status === "completed" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-medium">Work Completed</span>
          </div>
        )}
      </div>
    </div>
  )
}
