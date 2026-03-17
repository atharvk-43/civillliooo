"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GrievanceForm } from "@/components/grievances/grievance-form"
import { FeedbackForm } from "@/components/grievances/feedback-form"
import { CheckCircle, Clock, MessageSquare, Wrench, Users } from "lucide-react"
import dynamic from "next/dynamic"
import { ModuleGrid } from "@/components/dashboard/module-grid"
import Link from "next/link"

const IndiaMap = dynamic(() => import("@/components/dashboard/india-map"), {
  ssr: false,
})

export default function CitizenLeaderDashboardPage() {
  const { role } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [grievances, setGrievances] = useState([
    {
      id: "GR001",
      name: "Arjun Sharma",
      issueType: "Pothole Damage",
      description: "Large pothole on Vijay Nagar main road",
      location: "Vijay Nagar, Indore",
      status: "Resolved",
      date: "2024-01-10",
      trackingId: "GR-2024-001847",
    },
    {
      id: "GR002",
      name: "Priya Verma",
      issueType: "Street Lighting",
      description: "Multiple street lights non-functional in Navlakha",
      location: "Navlakha, Indore",
      status: "In Review",
      date: "2024-01-14",
      trackingId: "GR-2024-001848",
    },
    {
      id: "GR003",
      name: "Rajesh Kumar",
      issueType: "Water Supply",
      description: "Irregular water supply in Azad Nagar",
      location: "Azad Nagar, Indore",
      status: "Assigned",
      date: "2024-01-12",
      trackingId: "GR-2024-001849",
    },
  ])
  const [feedback, setFeedback] = useState([
    {
      id: "FB001",
      name: "Neha Patel",
      category: "Website Usability",
      subject: "Dashboard navigation is intuitive",
      date: "2024-01-15",
    },
  ])

  useEffect(() => {
    if (role !== "citizen-leader") {
      router.push("/login")
    }
  }, [role, router])

  const handleGrievanceSubmit = (formData: any) => {
    const newGrievance = {
      id: `GR${String(grievances.length + 1).padStart(3, "0")}`,
      ...formData,
      status: "Submitted",
      date: new Date().toISOString().split("T")[0],
      trackingId: `GR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`,
    }
    setGrievances([newGrievance, ...grievances])
  }

  const handleFeedbackSubmit = (formData: any) => {
    const newFeedback = {
      id: `FB${String(feedback.length + 1).padStart(3, "0")}`,
      ...formData,
      date: new Date().toISOString().split("T")[0],
    }
    setFeedback([newFeedback, ...feedback])
  }

  if (role !== "citizen-leader") return null

  const resolvedCount = grievances.filter((g) => g.status === "Resolved").length
  const activeCount = grievances.filter((g) => g.status !== "Resolved").length

  return (
    <>
      <AppHeader />
      <PageContainer>
        <div className="space-y-8">
          <div className="border-b border-border pb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Citizen Leader Dashboard</h1>
            <p className="text-muted-foreground max-w-2xl">
              Manage grievances, provide feedback, and access full city management platform
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="map">City Map</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
              <TabsTrigger value="grievance">Submit Grievance</TabsTrigger>
              <TabsTrigger value="feedback">Website Feedback</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <ModuleGrid />
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">City Zones & Status Overview</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive map of Indore showing different zones with color-coded status indicators. Green indicates
                  good status, yellow indicates warning level, and red indicates critical issues. Zoom in to see more
                  details.
                </p>
                <IndiaMap />
              </div>

              {/* Zone Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-l-red-500">
                  <h3 className="font-semibold text-sm text-foreground mb-1">Critical Issues</h3>
                  <p className="text-2xl font-bold text-red-600">2 zones</p>
                  <p className="text-xs text-muted-foreground mt-1">Vijay Nagar, Super Corridor</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-yellow-500">
                  <h3 className="font-semibold text-sm text-foreground mb-1">Warning Level</h3>
                  <p className="text-2xl font-bold text-yellow-600">3 zones</p>
                  <p className="text-xs text-muted-foreground mt-1">Navlakha, Malviya Nagar, Nipania</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-green-500">
                  <h3 className="font-semibold text-sm text-foreground mb-1">Good Status</h3>
                  <p className="text-2xl font-bold text-green-600">3 zones</p>
                  <p className="text-xs text-muted-foreground mt-1">Azad Nagar, Palasia, Rau</p>
                </Card>
              </div>
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Total Grievances</p>
                      <p className="text-3xl font-bold text-foreground">{grievances.length}</p>
                    </div>
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Resolved</p>
                      <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Active</p>
                      <p className="text-3xl font-bold text-amber-600">{activeCount}</p>
                    </div>
                    <Clock className="h-10 w-10 text-amber-600" />
                  </div>
                </Card>
              </div>

              {/* Recent Grievances */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Recent Grievances</h2>
                <div className="space-y-3">
                  {grievances.slice(0, 5).map((grievance) => (
                    <Card key={grievance.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{grievance.issueType}</h3>
                            <Badge
                              variant="secondary"
                              className={
                                grievance.status === "Resolved"
                                  ? "bg-green-100 text-green-700"
                                  : grievance.status === "Assigned"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-blue-100 text-blue-700"
                              }
                            >
                              {grievance.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{grievance.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {grievance.location} • {grievance.date}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Feedback */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Recent Feedback</h2>
                <div className="space-y-3">
                  {feedback.slice(0, 5).map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{item.subject}</h3>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.name} • {item.date}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Grievance Tab */}
            <TabsContent value="grievance">
              <GrievanceForm onSubmit={handleGrievanceSubmit} />
            </TabsContent>

            {/* Work Orders Tab */}
            <TabsContent value="work-orders" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Manage Work Orders & Vendors</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Assign tasks to vendors and workers, track their progress, and manage the workforce network.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assign Work Order Card */}
                <Card className="p-6 border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Wrench className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Assign Work Order</h3>
                      <p className="text-sm text-muted-foreground">
                        Create and assign new tasks to vendors and workers for city maintenance and improvement
                      </p>
                    </div>
                  </div>
                  <Link href="/worker/assign-work-order">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Create New Work Order</Button>
                  </Link>
                </Card>

                {/* Manage Vendors Card */}
                <Card className="p-6 border-2 border-orange-200 bg-orange-50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Manage Vendors & Workers</h3>
                      <p className="text-sm text-muted-foreground">
                        View your network of vendors and field workers, check their ratings and availability
                      </p>
                    </div>
                  </div>
                  <Link href="/worker/vendors">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Vendors & Workers
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* Key Information */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">Work Order Management Guidelines</h3>
                <div className="space-y-2 text-blue-800 text-sm">
                  <p>
                    <strong>7-Day Response Deadline:</strong> All assigned workers must complete the task or submit a detailed
                    report within 7 days.
                  </p>
                  <p>
                    <strong>Priority Levels:</strong> Assign low, medium, high, or critical priority based on urgency and impact.
                  </p>
                  <p>
                    <strong>Vendor Ratings:</strong> Worker performance is tracked through ratings that affect future assignment
                    opportunities.
                  </p>
                  <p>
                    <strong>Cost Tracking:</strong> Monitor estimated vs. actual costs to manage your budget efficiently.
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <FeedbackForm onSubmit={handleFeedbackSubmit} />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  )
}
