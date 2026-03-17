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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Leaf, Cloud, Droplet, Zap } from "lucide-react"

const emissionsData = [
  { month: "Jan", total: 4200, transport: 1800, energy: 1600, waste: 800 },
  { month: "Feb", total: 4050, transport: 1750, energy: 1550, waste: 750 },
  { month: "Mar", total: 3900, transport: 1650, energy: 1500, waste: 750 },
  { month: "Apr", total: 3750, transport: 1600, energy: 1450, waste: 700 },
  { month: "May", total: 3600, transport: 1550, energy: 1400, waste: 650 },
  { month: "Jun", total: 3480, transport: 1480, energy: 1350, waste: 650 },
]

const initiativesTable = [
  {
    id: "G001",
    name: "Solar Panel Installation",
    target: "500 kW",
    progress: "340 kW",
    status: "In Progress",
    impact: "450 T CO2/yr",
  },
  {
    id: "G002",
    name: "Tree Planting Campaign",
    target: "50,000 trees",
    progress: "28,400 trees",
    status: "In Progress",
    impact: "250 T CO2/yr",
  },
  {
    id: "G003",
    name: "Electric Bus Fleet",
    target: "200 buses",
    progress: "145 buses",
    status: "In Progress",
    impact: "800 T CO2/yr",
  },
  {
    id: "G004",
    name: "Building Efficiency Retrofit",
    target: "150 buildings",
    progress: "42 buildings",
    status: "In Progress",
    impact: "650 T CO2/yr",
  },
  {
    id: "G005",
    name: "Waste Reduction Program",
    target: "70% diversion",
    progress: "35% diversion",
    status: "In Progress",
    impact: "300 T CO2/yr",
  },
]

const recommendedActions = [
  {
    id: "1",
    title: "Accelerate Solar Installation",
    description:
      "On track for 340/500 kW. Prioritize remaining 160 kW by Q4 to meet annual target and reduce grid reliance",
    priority: "high" as const,
    category: "Energy",
  },
  {
    id: "2",
    title: "Scale Electric Bus Deployment",
    description: "145/200 buses deployed. Current pace reaches only 170 by year-end. Increase procurement to 200",
    priority: "high" as const,
    category: "Transport",
  },
  {
    id: "3",
    title: "Building Retrofit Acceleration",
    description: "Only 28% of target buildings retrofitted. Expand contractor teams and secure additional funding",
    priority: "medium" as const,
    category: "Buildings",
  },
  {
    id: "4",
    title: "Tree Planting Community Engagement",
    description: "Involve citizen volunteers to accelerate planting from 28K to 50K target by year-end",
    priority: "medium" as const,
    category: "Community",
  },
]

export default function SustainabilityModule() {
  const [timeRange, setTimeRange] = useState("Year to Date")
  const [region, setRegion] = useState("All Zones")

  return (
    <>
      <AppHeader />
      <PageContainer>
        <ModuleLayout
          title="Sustainability"
          description="Environmental metrics, carbon footprint reduction, and green initiatives"
          timeRange={{
            selected: timeRange,
            options: ["Last 30 Days", "Last 90 Days", "Year to Date", "5-Year Goal"],
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
              label="Total Emissions"
              value="3,480"
              unit="T CO2e/mo"
              icon={<Cloud className="h-6 w-6" />}
              trend={{ value: 23, direction: "down", period: "YoY reduction" }}
            />
            <KPICard
              label="Renewable Energy"
              value="32%"
              icon={<Zap className="h-6 w-6" />}
              trend={{ value: 8, direction: "up", period: "of grid mix" }}
            />
            <KPICard
              label="Green Spaces"
              value="85.2"
              unit="km²"
              icon={<Leaf className="h-6 w-6" />}
              trend={{ value: 12, direction: "up", period: "expansion" }}
            />
            <KPICard
              label="Water Saved"
              value="2.8M"
              unit="L/month"
              icon={<Droplet className="h-6 w-6" />}
              trend={{ value: 18, direction: "up", period: "conservation" }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Emissions Reduction Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={emissionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--color-muted-foreground))" />
                  <YAxis stroke="hsl(var(--color-muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--color-card))",
                      border: "1px solid hsl(var(--color-border))",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "hsl(var(--color-foreground))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--color-chart-1))"
                    strokeWidth={2}
                    name="Total Emissions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Emissions by Source</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={emissionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--color-muted-foreground))" />
                  <YAxis stroke="hsl(var(--color-muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--color-card))",
                      border: "1px solid hsl(var(--color-border))",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "hsl(var(--color-foreground))" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "16px" }} />
                  <Area
                    type="monotone"
                    dataKey="transport"
                    stackId="1"
                    fill="hsl(var(--color-chart-2))"
                    name="Transport"
                  />
                  <Area type="monotone" dataKey="energy" stackId="1" fill="hsl(var(--color-chart-3))" name="Energy" />
                  <Area type="monotone" dataKey="waste" stackId="1" fill="hsl(var(--color-chart-4))" name="Waste" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Status Updates</h3>
            <AlertItem
              severity="warning"
              title="Building Retrofit Pace Lagging"
              description="Only 28% of target achieved (42/150 buildings). Current pace will miss Q4 deadline. Increase resources."
            />
            <AlertItem
              severity="info"
              title="Emissions Reduction on Track"
              description="23% YoY reduction achieved. Target of 40% reduction by 2030 is within reach with accelerated initiatives."
            />
            <AlertItem
              severity="info"
              title="Solar Installation Milestone"
              description="340 kW of 500 kW target installed. Pipeline shows remaining 160 kW installations scheduled for Q4."
            />
          </div>

          {/* Initiatives Table */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Active Green Initiatives</h3>
            <DataTable
              columns={[
                { id: "id", label: "Initiative ID", sortable: true },
                { id: "name", label: "Initiative Name", sortable: true },
                { id: "progress", label: "Progress", sortable: true },
                { id: "status", label: "Status", sortable: true },
                { id: "impact", label: "Annual Impact", align: "right" },
              ]}
              rows={initiativesTable}
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
