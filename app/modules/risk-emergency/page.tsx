"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { ModuleLayout } from "@/components/modules/module-layout"
import { KPICard } from "@/components/modules/kpi-card"
import { AlertItem } from "@/components/modules/alert-item"
import { RecommendedActions } from "@/components/modules/recommended-actions"
import { DataTable } from "@/components/modules/data-table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AlertTriangle, Shield, Ambulance, Flame } from "lucide-react"

const incidentData = [
  { zone: "Downtown", medical: 8, fire: 2, accidents: 12, resolved: 18 },
  { zone: "North", medical: 5, fire: 1, accidents: 8, resolved: 12 },
  { zone: "South", medical: 6, fire: 2, accidents: 10, resolved: 14 },
  { zone: "East", medical: 4, fire: 1, accidents: 6, resolved: 9 },
  { zone: "West", medical: 5, fire: 1, accidents: 9, resolved: 13 },
]

const incidentsTable = [
  { id: "I001", type: "Traffic Accident", zone: "Downtown", severity: "High", status: "In Response", time: "5 mins" },
  { id: "I002", type: "Medical Emergency", zone: "North", severity: "Critical", status: "In Response", time: "3 mins" },
  { id: "I003", type: "Structure Fire", zone: "South", severity: "Critical", status: "On Scene", time: "12 mins" },
  { id: "I004", type: "Traffic Accident", zone: "East", severity: "Medium", status: "Resolved", time: "22 mins" },
  { id: "I005", type: "Hazmat Alert", zone: "West", severity: "High", status: "Monitoring", time: "8 mins" },
]

const recommendedActions = [
  {
    id: "1",
    title: "Activate Emergency Protocol - Fire",
    description:
      "Structure fire in South Zone. Activate emergency shelter protocol and coordinate with utilities for gas/power shutdown",
    priority: "critical" as const,
    category: "Emergency",
  },
  {
    id: "2",
    title: "Deploy Additional Resources",
    description:
      "Downtown experiencing 3 simultaneous incidents. Request additional ambulances and police units from adjacent zones",
    priority: "high" as const,
    category: "Response",
  },
  {
    id: "3",
    title: "Public Alert - Traffic Accident",
    description: "Harbor Bridge accident blocking 2 lanes. Issue public alert and recommend alternative routes",
    priority: "high" as const,
    category: "Communication",
  },
  {
    id: "4",
    title: "Post-Incident Review",
    description: "Schedule review of yesterday's medical emergency response to identify process improvements",
    priority: "medium" as const,
    category: "Training",
  },
]

export default function RiskEmergencyModule() {
  const [timeRange, setTimeRange] = useState("Today")
  const [region, setRegion] = useState("All Zones")

  return (
    <>
      <AppHeader />
      <PageContainer>
        <ModuleLayout
          title="Risk & Emergency Response"
          description="Real-time incident management, emergency coordination, and disaster response"
          timeRange={{
            selected: timeRange,
            options: ["Last Hour", "Today", "Last 24 Hours", "Last 7 Days"],
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
              label="Active Incidents"
              value="7"
              icon={<AlertTriangle className="h-6 w-6" />}
              trend={{ value: 40, direction: "up", period: "vs average" }}
            />
            <KPICard
              label="Response Time"
              value="4.8"
              unit="min"
              icon={<Shield className="h-6 w-6" />}
              trend={{ value: 15, direction: "down", period: "improvement" }}
            />
            <KPICard
              label="Resolution Rate"
              value="92%"
              icon={<Ambulance className="h-6 w-6" />}
              trend={{ value: 3, direction: "up", period: "this month" }}
            />
            <KPICard
              label="Coverage"
              value="100%"
              variant="accent"
              icon={<Flame className="h-6 w-6" />}
              trend={{ value: 0, direction: "up", period: "maintained" }}
            />
          </div>

          {/* Chart */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Incidents by Type & Zone</h3>
              <ChartContainer
                config={{
                  medical: { label: "Medical", color: "hsl(var(--color-chart-1))" },
                  fire: { label: "Fire", color: "hsl(var(--color-chart-2))" },
                  accidents: { label: "Accidents", color: "hsl(var(--color-chart-3))" },
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incidentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="medical" fill="hsl(var(--color-chart-1))" />
                    <Bar dataKey="fire" fill="hsl(var(--color-chart-2))" />
                    <Bar dataKey="accidents" fill="hsl(var(--color-chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Critical Alerts</h3>
            <AlertItem
              severity="critical"
              title="Active Structure Fire - South Zone"
              description="Multi-story building fire in progress. All units engaged. Evacuation in progress. Utility coordination active."
              action={{ label: "View Details", onClick: () => {} }}
            />
            <AlertItem
              severity="critical"
              title="Multiple Incidents - Downtown"
              description="3 simultaneous incidents: 2 traffic accidents, 1 medical emergency. Additional units being deployed."
            />
            <AlertItem
              severity="warning"
              title="Severe Weather Alert"
              description="Storm warning issued for next 4 hours. Pre-position equipment and personnel in vulnerable areas."
            />
          </div>

          {/* Incidents Table */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Active Incidents</h3>
            <DataTable
              columns={[
                { id: "id", label: "Incident ID", sortable: true },
                { id: "type", label: "Type", sortable: true },
                { id: "zone", label: "Zone", sortable: true },
                { id: "severity", label: "Severity", sortable: true },
                { id: "status", label: "Status", align: "right" },
              ]}
              rows={incidentsTable}
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
