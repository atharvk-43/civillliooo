"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { GrievanceForm } from "@/components/grievances/grievance-form"
import { GrievanceHistory } from "@/components/grievances/grievance-history"
import { ParticipationDashboard } from "@/components/governance/participation-dashboard"
import { TransparentWorkflow } from "@/components/governance/transparent-workflow"
import { DemocraticAccountability } from "@/components/governance/democratic-accountability"
import { SmartCityNewsletterComponent } from "@/components/civic/smart-city-newsletter"
import { CivilPointsPortal } from "@/components/civic/civil-points-portal"
import { FeaturedCivilLeaderCard } from "@/components/civic/featured-civil-leader-card"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BarChart3, Shield, TrendingUp, Newspaper, Zap } from "lucide-react"

export default function CitizenPortalPage() {
  const { role, isLoading } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("submit")
  const [grievances, setGrievances] = useState([
    {
      id: "GR001",
      name: "Rajesh Kumar",
      issueType: "Pothole Damage",
      description: "Large pothole on Vijay Nagar main road causing vehicle damage",
      location: "Vijay Nagar, Indore",
      status: "In Review",
      date: "2024-01-14",
      trackingId: "GR-2024-001847",
    },
  ])

  useEffect(() => {
    if (!isLoading && role !== "citizen") {
      router.push("/login")
    }
  }, [role, isLoading, router])

  const handleSubmit = (formData: any) => {
    const newGrievance = {
      id: `GR${String(grievances.length + 1).padStart(3, "0")}`,
      ...formData,
      status: "Submitted",
      date: new Date().toISOString().split("T")[0],
      trackingId: `GR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`,
    }
    setGrievances([newGrievance, ...grievances])
    setActiveTab("track")
  }

  if (role !== "citizen") return null

  return (
    <>
      <AppHeader />
      <PageContainer>
        <div className="space-y-8">
          <div className="border-b border-border pb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Citizen Grievance Portal</h1>
            <p className="text-muted-foreground max-w-2xl">
              Submit complaints about city services and infrastructure. Track the status of your grievances in real-time
              and receive updates via email.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">Typical Response Time: 3-5 business days</p>
              <p>Your grievance will be acknowledged within 24 hours. You will receive email updates on the status.</p>
            </div>
          </div>

          {/* Featured Civic Leader for Elections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <FeaturedCivilLeaderCard />
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-6 border border-green-200 dark:border-green-900 space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Voting Impact
              </h3>
              <div className="space-y-2 text-sm text-foreground">
                <p><strong>Your vote matters!</strong> Citizens like you can directly influence who leads civic initiatives in the next term.</p>
                <p>Leaders are ranked by their commitment to resolving community issues and transparency in governance.</p>
                <p className="text-xs text-muted-foreground mt-3">Voting period: Elections on March 2026</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border grid-cols-2 md:grid-cols-7 flex-wrap h-auto">
              <TabsTrigger value="submit">Submit Grievance</TabsTrigger>
              <TabsTrigger value="track">Track Status</TabsTrigger>
              <TabsTrigger value="impact" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">My Impact</span>
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Workflow</span>
              </TabsTrigger>
              <TabsTrigger value="accountability" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span className="hidden sm:inline">Newsletter</span>
              </TabsTrigger>
              <TabsTrigger value="civil-points" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Civil Points</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submit">
              <GrievanceForm onSubmit={handleSubmit} />
            </TabsContent>

            <TabsContent value="track">
              <GrievanceHistory grievances={grievances} />
            </TabsContent>

            {/* My Impact Tab */}
            <TabsContent value="impact">
              <ParticipationDashboard
                userName="Rajesh Kumar"
                metrics={{
                  totalGrievances: 8,
                  resolvedCount: 6,
                  resolutionRate: 75,
                  averageResolutionDays: 5,
                  communityEngagementScore: 82,
                  trustScore: 78,
                }}
                grievanceImpacts={[
                  {
                    grievanceId: "GR001",
                    title: "Pothole on Vijay Nagar Main Road",
                    status: "Resolved",
                    impact: "High",
                    resolutionDate: "2024-01-28",
                    citizensAffected: 2400,
                    communityUpvotes: 156,
                  },
                  {
                    grievanceId: "GR002",
                    title: "Streetlight Failure - Sector 5",
                    status: "In Progress",
                    impact: "Medium",
                    citizensAffected: 890,
                    communityUpvotes: 45,
                  },
                  {
                    grievanceId: "GR003",
                    title: "Water Supply Disruption",
                    status: "Pending",
                    impact: "High",
                    citizensAffected: 5200,
                    communityUpvotes: 234,
                  },
                ]}
              />
            </TabsContent>

            {/* Workflow Transparency Tab */}
            <TabsContent value="workflow">
              <TransparentWorkflow
                grievanceId="GR-2024-001847"
                steps={[
                  {
                    id: "1",
                    title: "Grievance Submitted",
                    description: "Your complaint has been registered in our system",
                    icon: <AlertCircle className="h-6 w-6" />,
                    actor: "Citizen Portal",
                    timeline: "Immediate",
                    status: "completed",
                    timestamp: "2024-01-14, 2:30 PM",
                  },
                  {
                    id: "2",
                    title: "Initial Review",
                    description: "Grievance is being reviewed for validity and categorization",
                    icon: <AlertCircle className="h-6 w-6" />,
                    actor: "Department Admin",
                    timeline: "24 hours",
                    status: "completed",
                    timestamp: "2024-01-15, 10:00 AM",
                  },
                  {
                    id: "3",
                    title: "Assignment to Work Team",
                    description: "Assigned to field workers and vendors for resolution",
                    icon: <AlertCircle className="h-6 w-6" />,
                    actor: "Department Manager",
                    timeline: "2-3 days",
                    status: "current",
                    timestamp: "2024-01-17, 9:15 AM",
                  },
                  {
                    id: "4",
                    title: "On-Site Work",
                    description: "Field team is working on the issue at the specified location",
                    icon: <AlertCircle className="h-6 w-6" />,
                    actor: "Field Workers",
                    timeline: "5-7 days",
                    status: "pending",
                  },
                  {
                    id: "5",
                    title: "Completion & Verification",
                    description: "Work is completed and verified by supervisor",
                    icon: <AlertCircle className="h-6 w-6" />,
                    actor: "Work Supervisor",
                    timeline: "1-2 days",
                    status: "pending",
                  },
                ]}
                auditTrail={[
                  {
                    timestamp: "2024-01-17, 9:15 AM",
                    action: "Work Order Assigned",
                    actor: "Priya Sharma, Department Manager",
                    details: "Grievance assigned to Pothole Repair Team B with priority HIGH",
                  },
                  {
                    timestamp: "2024-01-15, 10:00 AM",
                    action: "Initial Review Completed",
                    actor: "Rahul Patel, System Admin",
                    details: "Grievance categorized as Infrastructure Maintenance - Approved for processing",
                  },
                  {
                    timestamp: "2024-01-14, 2:30 PM",
                    action: "Grievance Registered",
                    actor: "System",
                    details: "Grievance registered with tracking ID GR-2024-001847",
                  },
                ]}
              />
            </TabsContent>

            {/* Democratic Accountability Tab */}
            <TabsContent value="accountability">
              <DemocraticAccountability
                grievanceId="GR-2024-001847"
                status="In Progress"
                onSubmitFeedback={async (feedback) => {
                  // In a real app, this would submit to an API
                  console.log("Feedback submitted:", feedback)
                  return new Promise((resolve) => {
                    setTimeout(resolve, 1000)
                  })
                }}
                existingFeedback={[
                  {
                    id: "f1",
                    rating: 5,
                    comment:
                      "Excellent response! The team was professional and responsive. Work was completed ahead of schedule.",
                    date: "2024-01-25",
                    upvotes: 23,
                  },
                  {
                    id: "f2",
                    rating: 4,
                    comment:
                      "Good work overall. Could have communicated the timeline better upfront.",
                    date: "2024-01-24",
                    upvotes: 8,
                  },
                ]}
                allowAppeal={true}
              />
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletter">
              <SmartCityNewsletterComponent />
            </TabsContent>

            {/* Civil Points Tab */}
            <TabsContent value="civil-points">
              <CivilPointsPortal />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  )
}
