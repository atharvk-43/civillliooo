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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Trash2, Recycle, TrendingUp, CheckCircle } from "lucide-react"

const wasteComposition = [
  { name: "Organic", value: 42, fill: "hsl(var(--color-chart-1))" },
  { name: "Recyclables", value: 28, fill: "hsl(var(--color-chart-2))" },
  { name: "Plastic", value: 15, fill: "hsl(var(--color-chart-3))" },
  { name: "Other", value: 15, fill: "hsl(var(--color-chart-4))" },
]

const collectionData = [
  { zone: "Downtown", collected: 156, recycled: 58, target: 150 },
  { zone: "North", collected: 142, recycled: 44, target: 140 },
  { zone: "South", collected: 168, recycled: 62, target: 160 },
  { zone: "East", collected: 134, recycled: 38, target: 135 },
  { zone: "West", collected: 147, recycled: 51, target: 145 },
]

const landfillData = [
  { id: "L001", name: "North Landfill", capacity: "2,400T", utilization: "72%", status: "Operational" },
  { id: "L002", name: "South Landfill", capacity: "1,800T", utilization: "88%", status: "Near Capacity" },
  { id: "L003", name: "East Transfer Center", capacity: "600T", utilization: "45%", status: "Operational" },
  { id: "L004", name: "Recycling Hub", capacity: "400T", utilization: "62%", status: "Operational" },
  { id: "L005", name: "Compost Facility", capacity: "350T", utilization: "58%", status: "Operational" },
]

const recommendedActions = [
  {
    id: "1",
    title: "South Landfill Capacity Management",
    description: "Utilization at 88%. Redirect incoming waste to East Transfer Center to prevent overflow",
    priority: "high" as const,
    category: "Operations",
  },
  {
    id: "2",
    title: "Increase Recycling Program",
    description: "Recycling rate at 35%. Launch community awareness campaign to reach 45% target",
    priority: "high" as const,
    category: "Sustainability",
  },
  {
    id: "3",
    title: "Optimize Collection Routes",
    description: "East Zone collection efficiency below target. Reorganize schedule to improve pickup frequency",
    priority: "medium" as const,
    category: "Operations",
  },
  {
    id: "4",
    title: "Schedule Equipment Maintenance",
    description: "Compactor units showing increased wear. Preventive maintenance needed for 3 vehicles",
    priority: "medium" as const,
    category: "Maintenance",
  },
]

export default function WasteManagementModule() {
  const [timeRange, setTimeRange] = useState("Today")
  const [region, setRegion] = useState("All Zones")

  return (
    <>
      <AppHeader />
      <PageContainer>
        <ModuleLayout
          title="Waste Management"
          description="Waste collection, recycling programs, and landfill management"
          timeRange={{
            selected: timeRange,
            options: ["Today", "Last 7 Days", "Last 30 Days", "Year to Date"],
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
              label="Daily Collection"
              value="747"
              unit="Tonnes"
              icon={<Trash2 className="h-6 w-6" />}
              trend={{ value: 12, direction: "up", period: "vs average" }}
            />
            <KPICard
              label="Recycling Rate"
              value="35%"
              icon={<Recycle className="h-6 w-6" />}
              trend={{ value: 8, direction: "up", period: "this quarter" }}
            />
            <KPICard
              label="Landfill Utilization"
              value="72%"
              icon={<TrendingUp className="h-6 w-6" />}
              trend={{ value: 5, direction: "up", period: "average" }}
            />
            <KPICard
              label="On-Time Collections"
              value="96%"
              icon={<CheckCircle className="h-6 w-6" />}
              trend={{ value: 2, direction: "up", period: "this month" }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Waste Composition</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={wasteComposition} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                    {wasteComposition.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Collection & Recycling by Zone</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="collected" fill="hsl(var(--color-chart-1))" name="Collected (T)" />
                  <Bar dataKey="recycled" fill="hsl(var(--color-chart-2))" name="Recycled (T)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Active Alerts</h3>
            <AlertItem
              severity="critical"
              title="South Landfill Approaching Capacity"
              description="Utilization at 88%. Implement immediate waste diversion to East Transfer Center to prevent overflow."
            />
            <AlertItem
              severity="warning"
              title="Equipment Maintenance Required"
              description="3 collection vehicles showing increased wear. Schedule preventive maintenance within 48 hours."
            />
            <AlertItem
              severity="info"
              title="Recycling Program Expansion"
              description="Pilot program in North Zone showing positive results. Ready to scale to East Zone next quarter."
            />
          </div>

          {/* Facilities Table */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Facilities Status</h3>
            <DataTable
              columns={[
                { id: "id", label: "Facility ID", sortable: true },
                { id: "name", label: "Facility Name", sortable: true },
                { id: "capacity", label: "Capacity", sortable: true },
                { id: "utilization", label: "Utilization", align: "right", sortable: true },
                { id: "status", label: "Status", align: "right", sortable: true },
              ]}
              rows={landfillData}
              pagination={{ current: 1, total: 12, pageSize: 5 }}
            />
          </div>

          {/* Recommended Actions */}
          <RecommendedActions actions={recommendedActions} />
        </ModuleLayout>
      </PageContainer>
    </>
  )
}
