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
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Navigation, Zap, AlertTriangle, Clock } from "lucide-react"

const trafficData = [
  { time: "00:00", congestion: 15, vehicles: 1200, avgSpeed: 45 },
  { time: "06:00", congestion: 35, vehicles: 3400, avgSpeed: 32 },
  { time: "09:00", congestion: 78, vehicles: 7200, avgSpeed: 18 },
  { time: "12:00", congestion: 55, vehicles: 5100, avgSpeed: 28 },
  { time: "15:00", congestion: 65, vehicles: 6800, avgSpeed: 22 },
  { time: "18:00", congestion: 82, vehicles: 8900, avgSpeed: 15 },
  { time: "21:00", congestion: 48, vehicles: 4600, avgSpeed: 35 },
]

const routeData = [
  { id: "R001", name: "Main Street Corridor", status: "Heavy Congestion", vehicles: 1240, avgDelay: "18 min" },
  { id: "R002", name: "Downtown Express", status: "Moderate", vehicles: 680, avgDelay: "8 min" },
  { id: "R003", name: "Airport Road", status: "Clear", vehicles: 420, avgDelay: "3 min" },
  { id: "R004", name: "Harbor Bridge", status: "Heavy Congestion", vehicles: 1580, avgDelay: "22 min" },
  { id: "R005", name: "North Bypass", status: "Moderate", vehicles: 910, avgDelay: "12 min" },
]

const recommendedActions = [
  {
    id: "1",
    title: "Activate Dynamic Route Guidance",
    description:
      "Deploy AI-based traffic diversion to Main Street and Harbor Bridge - potential 15% congestion reduction",
    priority: "high" as const,
    category: "Operations",
  },
  {
    id: "2",
    title: "Coordinate with Transit Authority",
    description: "Increase public transport frequency during peak hours (5-7 PM) to reduce private vehicle demand",
    priority: "high" as const,
    category: "Coordination",
  },
  {
    id: "3",
    title: "Event Impact Analysis",
    description: "Stadium event at 7 PM expected to add 3-5K vehicles. Monitor and activate contingency routes",
    priority: "medium" as const,
    category: "Planning",
  },
  {
    id: "4",
    title: "Review Parking Availability",
    description: "Downtown parking capacity near 85%. Activate dynamic pricing to incentivize peripheral parking",
    priority: "medium" as const,
    category: "Parking",
  },
]

export default function TrafficMobilityModule() {
  const [timeRange, setTimeRange] = useState("Today")
  const [region, setRegion] = useState("All Zones")

  return (
    <>
      <AppHeader />
      <PageContainer>
        <ModuleLayout
          title="Traffic & Mobility"
          description="Real-time traffic monitoring, public transport optimization, and road networks"
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
              label="Vehicles Tracked"
              value="28,340"
              icon={<Navigation className="h-6 w-6" />}
              trend={{ value: 8, direction: "up", period: "peak hour" }}
            />
            <KPICard
              label="Avg. Congestion"
              value="58%"
              icon={<AlertTriangle className="h-6 w-6" />}
              trend={{ value: 12, direction: "up", period: "vs yesterday" }}
            />
            <KPICard
              label="Avg. Speed"
              value="24 km/h"
              icon={<Zap className="h-6 w-6" />}
              trend={{ value: 15, direction: "down", period: "peak hours" }}
            />
            <KPICard
              label="Route Delays"
              value="14.2 min"
              icon={<Clock className="h-6 w-6" />}
              trend={{ value: 6, direction: "up", period: "vs last week" }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Congestion Levels (24H)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="congestion"
                    fill="hsl(var(--color-chart-1))"
                    stroke="hsl(var(--color-chart-1))"
                    name="Congestion %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Vehicle Count & Average Speed</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="vehicles" stroke="hsl(var(--color-chart-2))" name="Vehicles" />
                  <Line type="monotone" dataKey="avgSpeed" stroke="hsl(var(--color-chart-3))" name="Avg Speed (km/h)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Active Alerts</h3>
            <AlertItem
              severity="critical"
              title="Major Incident - Harbor Bridge"
              description="Multi-vehicle accident blocking 3 of 4 lanes. Emergency services on-site. Expect 30-40 min delays."
            />
            <AlertItem
              severity="warning"
              title="High Congestion - Downtown Corridor"
              description="Main Street experiencing 82% congestion due to stadium event traffic. Recommend alternative routes."
            />
            <AlertItem
              severity="info"
              title="Maintenance Alert - Traffic Signal"
              description="Scheduled maintenance on 15 signals in West Zone (2 AM - 4 AM). Emergency backup systems active."
            />
          </div>

          {/* Routes Table */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Major Routes Status</h3>
            <DataTable
              columns={[
                { id: "id", label: "Route ID", sortable: true },
                { id: "name", label: "Route Name", sortable: true },
                { id: "status", label: "Status", sortable: true },
                { id: "vehicles", label: "Vehicles", align: "right", sortable: true },
                { id: "avgDelay", label: "Avg Delay", align: "right", sortable: true },
              ]}
              rows={routeData}
              pagination={{ current: 1, total: 18, pageSize: 5 }}
            />
          </div>

          {/* Recommended Actions */}
          <RecommendedActions actions={recommendedActions} />
        </ModuleLayout>
      </PageContainer>
    </>
  )
}
