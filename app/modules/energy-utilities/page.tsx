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
import { Zap, Droplet, Leaf } from "lucide-react"

const consumptionData = [
  { hour: "00:00", power: 420, water: 280, gas: 120 },
  { hour: "04:00", power: 380, water: 220, gas: 100 },
  { hour: "08:00", power: 680, water: 520, gas: 180 },
  { hour: "12:00", power: 750, water: 640, gas: 160 },
  { hour: "16:00", power: 820, water: 680, gas: 190 },
  { hour: "20:00", power: 900, water: 720, gas: 220 },
  { hour: "23:00", power: 520, water: 360, gas: 140 },
]

const facilityData = [
  { id: "F001", name: "North Water Treatment", utility: "Water", load: 82, loadDisplay: "82%", status: "Operational" },
  { id: "F002", name: "Central Power Station", utility: "Power", load: 94, loadDisplay: "94%", status: "High Load" },
  { id: "F003", name: "East Distribution Hub", utility: "Power", load: 67, loadDisplay: "67%", status: "Operational" },
  { id: "F004", name: "South Gas Terminal", utility: "Gas", load: 45, loadDisplay: "45%", status: "Operational" },
  { id: "F005", name: "West Water Plant", utility: "Water", load: 71, loadDisplay: "71%", status: "Operational" },
]

const recommendedActions = [
  {
    id: "1",
    title: "Address Power Station Load",
    description: "Central station operating at 94% capacity. Coordinate with East Hub to redistribute 150MW load",
    priority: "high" as const,
    category: "Grid Management",
  },
  {
    id: "2",
    title: "Schedule Water Infrastructure Maintenance",
    description: "North plant at 82% load. Perform preventive valve maintenance during 2-4 AM low-demand window",
    priority: "medium" as const,
    category: "Maintenance",
  },
  {
    id: "3",
    title: "Activate Demand Response Program",
    description: "Peak demand forecasted for 8-10 PM. Encourage commercial consumers to shift usage for 12% savings",
    priority: "medium" as const,
    category: "Efficiency",
  },
  {
    id: "4",
    title: "Review Renewable Integration",
    description: "Solar generation at 140% of target. Optimize battery storage to capture excess renewable capacity",
    priority: "low" as const,
    category: "Sustainability",
  },
]

export default function EnergyUtilitiesModule() {
  const [timeRange, setTimeRange] = useState("Today")
  const [region, setRegion] = useState("All Zones")

  return (
    <>
      <AppHeader />
      <PageContainer>
        <ModuleLayout
          title="Energy & Utilities"
          description="Power grid management, water distribution, gas supply, and utility optimization"
          timeRange={{
            selected: timeRange,
            options: ["Last 24 Hours", "Today", "Last 7 Days", "Last 30 Days"],
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
              label="Power Consumption"
              value="8,340"
              unit="MWh"
              icon={<Zap className="h-6 w-6" />}
              trend={{ value: 14, direction: "up", period: "peak hours" }}
            />
            <KPICard
              label="Grid Efficiency"
              value="94.2%"
              icon={<Leaf className="h-6 w-6" />}
              trend={{ value: 2, direction: "up", period: "vs yesterday" }}
            />
            <KPICard
              label="Water Availability"
              value="2,420"
              unit="ML/day"
              icon={<Droplet className="h-6 w-6" />}
              trend={{ value: 8, direction: "down", period: "vs forecast" }}
            />
            <KPICard
              label="Renewable %"
              value="32%"
              icon={<Leaf className="h-6 w-6" />}
              trend={{ value: 5, direction: "up", period: "annual target" }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Utility Consumption (24H)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="power" stroke="hsl(var(--color-chart-1))" name="Power (MWh)" />
                  <Line type="monotone" dataKey="water" stroke="hsl(var(--color-chart-2))" name="Water (ML)" />
                  <Line type="monotone" dataKey="gas" stroke="hsl(var(--color-chart-3))" name="Gas (MCM)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Facility Load Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={facilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="load" fill="hsl(var(--color-chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Active Alerts</h3>
            <AlertItem
              severity="critical"
              title="High Load Alert - Central Power Station"
              description="Operating at 94% capacity during peak demand. Recommend load redistribution to East Hub immediately."
            />
            <AlertItem
              severity="warning"
              title="Water Level Advisory"
              description="Reservoir levels 8% below seasonal average. Restrict non-essential water usage during peak hours."
            />
            <AlertItem
              severity="info"
              title="Renewable Energy Optimization"
              description="Solar generation exceeding forecast. Battery storage at 95% capacity. Consider demand response activation."
            />
          </div>

          {/* Facilities Table */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Infrastructure Facilities</h3>
            <DataTable
              columns={[
                { id: "id", label: "Facility ID", sortable: true },
                { id: "name", label: "Facility Name", sortable: true },
                { id: "utility", label: "Utility", sortable: true },
                { id: "loadDisplay", label: "Load", align: "right", sortable: true },
                { id: "status", label: "Status", align: "right", sortable: true },
              ]}
              rows={facilityData}
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
