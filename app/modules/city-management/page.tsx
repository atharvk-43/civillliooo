"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { ModuleLayout } from "@/components/modules/module-layout"
import { KPICard } from "@/components/modules/kpi-card"
import { AlertItem } from "@/components/modules/alert-item"
import { RecommendedActions } from "@/components/modules/recommended-actions"
import { DataTable } from "@/components/modules/data-table"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Building2, Briefcase, Users, DollarSign } from "lucide-react"

const chartData = [
  { month: "Jan", projects: 45, budget: 85000, completion: 72 },
  { month: "Feb", projects: 52, budget: 92000, completion: 78 },
  { month: "Mar", projects: 48, budget: 88000, completion: 81 },
  { month: "Apr", projects: 61, budget: 105000, completion: 85 },
  { month: "May", projects: 55, budget: 97000, completion: 88 },
  { month: "Jun", projects: 67, budget: 118000, completion: 91 },
]

const projectsTable = [
  { id: "P001", name: "Central Park Renovation", status: "In Progress", budget: "$145K", completion: "75%" },
  { id: "P002", name: "Water Infrastructure Upgrade", status: "Completed", budget: "$340K", completion: "100%" },
  { id: "P003", name: "Smart Lighting Network", status: "In Progress", budget: "$265K", completion: "62%" },
  { id: "P004", name: "Municipal Building Renovation", status: "Planning", budget: "$520K", completion: "15%" },
  { id: "P005", name: "Public Health Facility", status: "In Progress", budget: "$410K", completion: "48%" },
]

const recommendedActions = [
  {
    id: "1",
    title: "Review Q2 Budget Allocation",
    description: "Reallocate $85K to accelerate water infrastructure project ahead of monsoon season",
    priority: "high" as const,
    category: "Budget",
  },
  {
    id: "2",
    title: "Approve Central Park Final Phase",
    description: "Green-light phase 3 pending environmental review completion",
    priority: "high" as const,
    category: "Approvals",
  },
  {
    id: "3",
    title: "Coordinate with Contractor",
    description: "Schedule progress review meeting for Smart Lighting project",
    priority: "medium" as const,
    category: "Operations",
  },
  {
    id: "4",
    title: "Public Communication Update",
    description: "Publish quarterly progress report to citizen website",
    priority: "low" as const,
    category: "Communication",
  },
]

export default function CityManagementModule() {
  const [timeRange, setTimeRange] = useState("Last 6 Months")
  const [region, setRegion] = useState("All Zones")

  return (
    <>
      <AppHeader />
      <PageContainer>
        <ModuleLayout
          title="City Management"
          description="Municipal operations, project governance, and budget oversight"
          timeRange={{
            selected: timeRange,
            options: ["Last Month", "Last 3 Months", "Last 6 Months", "Year to Date"],
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
              label="Active Projects"
              value="67"
              icon={<Building2 className="h-6 w-6" />}
              trend={{ value: 12, direction: "up", period: "vs last month" }}
            />
            <KPICard
              label="Total Budget"
              value="$2.8M"
              icon={<DollarSign className="h-6 w-6" />}
              trend={{ value: 8, direction: "up", period: "utilization" }}
            />
            <KPICard
              label="Avg Completion"
              value="76%"
              icon={<Briefcase className="h-6 w-6" />}
              trend={{ value: 5, direction: "up", period: "vs last quarter" }}
            />
            <KPICard
              label="Contractors"
              value="124"
              icon={<Users className="h-6 w-6" />}
              trend={{ value: 3, direction: "down", period: "reduction" }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Project Completion Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--color-foreground))" />
                  <YAxis stroke="hsl(var(--color-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--color-background))",
                      border: "1px solid hsl(var(--color-border))",
                      borderRadius: "8px",
                      color: "hsl(var(--color-foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="hsl(var(--color-chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--color-chart-1))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Monthly Budget vs Spending</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--color-foreground))" />
                  <YAxis stroke="hsl(var(--color-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--color-background))",
                      border: "1px solid hsl(var(--color-border))",
                      borderRadius: "8px",
                      color: "hsl(var(--color-foreground))",
                    }}
                  />
                  <Bar dataKey="budget" fill="hsl(var(--color-chart-2))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="projects" fill="hsl(var(--color-chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Active Alerts</h3>
            <AlertItem
              severity="critical"
              title="Budget Overrun - Central Park Phase 2"
              description="Project has exceeded budget by $42K. Immediate review required before phase 3 approval."
            />
            <AlertItem
              severity="warning"
              title="Timeline Risk - Smart Lighting"
              description="Current pace may miss Q3 completion target. Weather delays anticipated in next 2 weeks."
            />
            <AlertItem
              severity="info"
              title="Contractor Compliance Review Pending"
              description="Annual audit of 8 active contractors scheduled for June. Documentation preparation underway."
            />
          </div>

          {/* Projects Table */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Active Projects</h3>
            <DataTable
              columns={[
                { id: "id", label: "Project ID", sortable: true },
                { id: "name", label: "Project Name", sortable: true },
                { id: "status", label: "Status", sortable: true },
                { id: "budget", label: "Budget", align: "right", sortable: true },
                { id: "completion", label: "Completion", align: "right", sortable: true },
              ]}
              rows={projectsTable}
              pagination={{ current: 1, total: 24, pageSize: 5 }}
            />
          </div>

          {/* Recommended Actions */}
          <RecommendedActions actions={recommendedActions} />
        </ModuleLayout>
      </PageContainer>
    </>
  )
}
