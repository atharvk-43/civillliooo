"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { ModuleLayout } from "@/components/modules/module-layout"
import { KPICard } from "@/components/modules/kpi-card"
import { AlertItem } from "@/components/modules/alert-item"
import { RecommendedActions } from "@/components/modules/recommended-actions"
import { DataTable } from "@/components/modules/data-table"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, Clock, CheckCircle, AlertTriangle } from "lucide-react"

const serviceData = [
  { day: "Mon", permits: 48, licenses: 32, complaints: 24, resolved: 22 },
  { day: "Tue", permits: 52, licenses: 38, complaints: 28, resolved: 26 },
  { day: "Wed", permits: 45, licenses: 35, complaints: 31, resolved: 28 },
  { day: "Thu", permits: 58, licenses: 41, complaints: 26, resolved: 25 },
  { day: "Fri", permits: 64, licenses: 44, complaints: 35, resolved: 32 },
  { day: "Sat", permits: 28, licenses: 18, complaints: 18, resolved: 17 },
]

const servicesTable = [
  { id: "S001", type: "Building Permits", applications: 247, approved: 198, pending: 49, avgTime: "8 days" },
  { id: "S002", type: "Business Licenses", applications: 156, approved: 142, pending: 14, avgTime: "5 days" },
  { id: "S003", type: "Property Certificates", applications: 382, approved: 368, pending: 14, avgTime: "3 days" },
  { id: "S004", type: "Complaint Resolution", applications: 134, approved: 118, pending: 16, avgTime: "6 days" },
  { id: "S005", type: "Event Permits", applications: 42, approved: 38, pending: 4, avgTime: "4 days" },
]

const recommendedActions = [
  {
    id: "1",
    title: "Reduce Permit Processing Time",
    description: "Building permits averaging 8 days. Implement online validation system to reduce to 5 days",
    priority: "high" as const,
    category: "Efficiency",
  },
  {
    id: "2",
    title: "Complaint Resolution Review",
    description: "16 complaints pending over 10 days. Escalate to department heads for expedited resolution",
    priority: "high" as const,
    category: "Service Quality",
  },
  {
    id: "3",
    title: "Citizen Portal Enhancement",
    description: "Mobile app usage only 23%. Redesign portal for better UX and increase adoption to 60%",
    priority: "medium" as const,
    category: "Digital Services",
  },
  {
    id: "4",
    title: "Staff Training for Peak Hours",
    description: "Friday service requests spike by 35%. Cross-train staff to handle increased Friday demand",
    priority: "medium" as const,
    category: "Operations",
  },
]

export default function CitizenServicesModule() {
  const [timeRange, setTimeRange] = useState("Last 30 Days")
  const [region, setRegion] = useState("All Zones")

  return (
    <>
      <AppHeader />
      <PageContainer>
        <ModuleLayout
          title="Citizen Services"
          description="Public permits, licenses, grievances, and service delivery"
          timeRange={{
            selected: timeRange,
            options: ["This Week", "Last 30 Days", "Last 90 Days", "Year to Date"],
            onSelect: setTimeRange,
          }}
          region={{
            selected: region,
            options: ["All Zones", "Downtown", "North Zone", "South Zone", "East Zone", "West Zone"],
            onSelect: setRegion,
          }}
        >
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Active Users"
              value="12,847"
              icon={<Users className="h-6 w-6" />}
              trend={{ value: 18, direction: "up", period: "this month" }}
            />
            <KPICard
              label="Avg Response Time"
              value="6.2"
              unit="days"
              icon={<Clock className="h-6 w-6" />}
              trend={{ value: 12, direction: "down", period: "improvement" }}
            />
            <KPICard
              label="Resolution Rate"
              value="94%"
              icon={<CheckCircle className="h-6 w-6" />}
              trend={{ value: 4, direction: "up", period: "vs last month" }}
            />
            <KPICard
              label="Citizen Satisfaction"
              value="87%"
              icon={<AlertTriangle className="h-6 w-6" />}
              trend={{ value: 6, direction: "up", period: "this quarter" }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Weekly Service Requests</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="permits" fill="hsl(var(--color-chart-1))" name="Permits" />
                  <Bar dataKey="licenses" fill="hsl(var(--color-chart-2))" name="Licenses" />
                  <Bar dataKey="complaints" fill="hsl(var(--color-chart-3))" name="Complaints" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Resolution Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="hsl(var(--color-chart-1))"
                    strokeWidth={2}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Active Alerts</h3>
            <AlertItem
              severity="critical"
              title="Complaint Resolution Backlog"
              description="16 complaints pending beyond SLA (10 days). Allocate resources for expedited resolution."
            />
            <AlertItem
              severity="warning"
              title="Building Permit Delays"
              description="Processing time increased to 8 days from 5-day target. Review staffing and workflow bottlenecks."
            />
            <AlertItem
              severity="info"
              title="Mobile Portal Adoption Low"
              description="Only 23% of citizens using mobile app. Launch UI/UX improvement initiative to increase adoption."
            />
          </div>

          {/* Services Table */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Service Performance</h3>
            <DataTable
              columns={[
                { id: "id", label: "Service ID", sortable: true },
                { id: "type", label: "Service Type", sortable: true },
                { id: "applications", label: "Applications", align: "right", sortable: true },
                { id: "approved", label: "Approved", align: "right", sortable: true },
                { id: "avgTime", label: "Avg Time", align: "right", sortable: true },
              ]}
              rows={servicesTable}
              pagination={{ current: 1, total: 8, pageSize: 5 }}
            />
          </div>

          {/* Recommended Actions */}
          <RecommendedActions actions={recommendedActions} />
        </ModuleLayout>
      </PageContainer>
    </>
  )
}
