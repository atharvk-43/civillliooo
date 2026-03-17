"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { GrievanceForm } from "@/components/grievances/grievance-form"
import { GrievanceHistory } from "@/components/grievances/grievance-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"

export default function GrievancesPage() {
  const [activeTab, setActiveTab] = useState("submit")
  const [grievances, setGrievances] = useState([
    {
      id: "GR001",
      name: "Rajesh Kumar",
      issueType: "Pothole Damage",
      description: "Large pothole on Main Street causing vehicle damage",
      location: "Main Street, Downtown Zone",
      status: "In Review",
      date: "2024-01-14",
      trackingId: "GR-2024-001847",
    },
    {
      id: "GR002",
      name: "Priya Sharma",
      issueType: "Street Lighting",
      description: "Multiple street lights non-functional in residential area",
      location: "North Zone, Block C",
      status: "Assigned",
      date: "2024-01-12",
      trackingId: "GR-2024-001846",
    },
    {
      id: "GR003",
      name: "Ahmad Hassan",
      issueType: "Water Supply",
      description: "Irregular water supply causing inconvenience",
      location: "East Zone, Plot 42",
      status: "Resolved",
      date: "2024-01-10",
      trackingId: "GR-2024-001845",
    },
  ])

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

  return (
    <>
      <AppHeader />
      <PageContainer>
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Citizen Grievance Portal</h1>
            <p className="text-muted-foreground max-w-2xl">
              Submit complaints about city services and infrastructure. Track the status of your grievances in real-time
              and receive updates via email.
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">Typical Response Time: 3-5 business days</p>
              <p>Your grievance will be acknowledged within 24 hours. You will receive email updates on the status.</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="submit">Submit Grievance</TabsTrigger>
              <TabsTrigger value="track">Track Status</TabsTrigger>
            </TabsList>

            {/* Submit Tab */}
            <TabsContent value="submit">
              <GrievanceForm onSubmit={handleSubmit} />
            </TabsContent>

            {/* Track Tab */}
            <TabsContent value="track">
              <GrievanceHistory grievances={grievances} />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  )
}
