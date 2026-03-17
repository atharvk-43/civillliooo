"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Filter, Plus, Zap } from "lucide-react"

// Mock asset data
const assetsData = [
  {
    id: 1,
    code: "VH-001",
    name: "Waste Collection Truck #1",
    type: "vehicle",
    category: "waste_truck",
    status: "active",
    location: "Central Depot",
    purchaseDate: "2020-03-15",
    purchaseCost: 85000,
    currentValue: 52000,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    maintenanceInterval: 30,
    operatingHours: 5420,
    licensePlate: "WC-0821",
  },
  {
    id: 2,
    code: "EQ-001",
    name: "Water Treatment Pump",
    type: "equipment",
    category: "water_pump",
    status: "active",
    location: "Central Water Station",
    purchaseDate: "2019-06-20",
    purchaseCost: 125000,
    currentValue: 68000,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-01-25",
    maintenanceInterval: 20,
    operatingHours: 8760,
  },
  {
    id: 3,
    code: "VH-002",
    name: "Street Sweeper Vehicle",
    type: "vehicle",
    category: "sweeper",
    status: "active",
    location: "North District Depot",
    purchaseDate: "2021-09-10",
    purchaseCost: 45000,
    currentValue: 36000,
    lastMaintenance: "2023-12-28",
    nextMaintenance: "2024-02-15",
    maintenanceInterval: 45,
    operatingHours: 3200,
    licensePlate: "SS-0415",
  },
  {
    id: 4,
    code: "INF-001",
    name: "Traffic Light System - Main St",
    type: "infrastructure",
    category: "traffic_light",
    status: "active",
    location: "Main Street Intersection",
    purchaseDate: "2018-04-15",
    purchaseCost: 12000,
    currentValue: 5200,
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-02-08",
    maintenanceInterval: 30,
  },
  {
    id: 5,
    code: "EQ-002",
    name: "Landfill Compactor",
    type: "equipment",
    category: "waste_compactor",
    status: "under_maintenance",
    location: "City Landfill",
    purchaseDate: "2017-11-02",
    purchaseCost: 250000,
    currentValue: 95000,
    lastMaintenance: "2024-01-12",
    nextMaintenance: "2024-03-01",
    maintenanceInterval: 60,
    operatingHours: 12450,
  },
]

const maintenanceScheduleData = [
  { id: 1, assetCode: "VH-001", assetName: "Waste Truck #1", scheduledDate: "2024-02-10", status: "scheduled" },
  { id: 2, assetCode: "EQ-001", assetName: "Water Pump", scheduledDate: "2024-01-25", status: "overdue" },
  { id: 3, assetCode: "VH-002", assetName: "Street Sweeper", scheduledDate: "2024-02-15", status: "scheduled" },
  { id: 4, assetCode: "INF-001", assetName: "Traffic Lights", scheduledDate: "2024-02-08", status: "scheduled" },
]

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  under_maintenance: "bg-yellow-100 text-yellow-800",
  decommissioned: "bg-red-100 text-red-800",
}

export default function AssetsPage() {
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
  })

  const filteredAssets = assetsData.filter((asset) => {
    if (filters.type !== "all" && asset.type !== filters.type) return false
    if (filters.status !== "all" && asset.status !== filters.status) return false
    return true
  })

  const overdueMaintenanceCount = maintenanceScheduleData.filter((m) => m.status === "overdue").length
  const totalAssets = assetsData.length
  const activeAssets = assetsData.filter((a) => a.status === "active").length
  const totalValue = assetsData.reduce((sum, a) => sum + (a.currentValue || 0), 0)

  return (
    <>
      <AppHeader />
      <PageContainer
        title="Asset & Maintenance Management"
        description="Monitor equipment, vehicles, infrastructure and schedule preventive maintenance"
      >
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{totalAssets}</div>
                <div className="text-sm text-muted-foreground">Total Assets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{activeAssets}</div>
                <div className="text-sm text-muted-foreground">Active Assets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Total Asset Value</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">{overdueMaintenanceCount}</div>
                    <div className="text-sm text-red-700 dark:text-red-300">Overdue Maintenance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
              >
                <option value="all">All Types</option>
                <option value="vehicle">Vehicles</option>
                <option value="equipment">Equipment</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Link href="/erp/assets/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Register Asset
              </Button>
            </Link>
          </div>

          {/* Assets Table */}
          <Card>
            <CardHeader>
              <CardTitle>City Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAssets.map((asset) => {
                  const maintenanceDaysOverdue =
                    asset.nextMaintenance &&
                    (new Date(asset.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  const isMaintenceOverdue = maintenanceDaysOverdue !== false && maintenanceDaysOverdue < 0

                  return (
                    <div
                      key={asset.id}
                      className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {asset.code}: {asset.name}
                            </h3>
                            {isMaintenceOverdue && <AlertTriangle className="w-4 h-4 text-red-600" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{asset.location}</p>
                        </div>
                        <Badge className={statusColors[asset.status]}>{asset.status.replace("_", " ")}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-muted-foreground">Type</div>
                          <div className="font-medium capitalize">{asset.type}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Purchase Cost</div>
                          <div className="font-medium">${(asset.purchaseCost / 1000).toFixed(0)}k</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Current Value</div>
                          <div className="font-medium">${(asset.currentValue / 1000).toFixed(0)}k</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Last Maintenance</div>
                          <div className="font-medium">{new Date(asset.lastMaintenance).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Next Maintenance</div>
                          <div className={`font-medium ${isMaintenceOverdue ? "text-red-600" : ""}`}>
                            {new Date(asset.nextMaintenance).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {asset.operatingHours && (
                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Zap className="w-4 h-4" />
                            {asset.operatingHours.toLocaleString()} operating hours
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {maintenanceScheduleData.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div>
                      <div className="font-medium">{schedule.assetName}</div>
                      <div className="text-sm text-muted-foreground">{schedule.assetCode}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{new Date(schedule.scheduledDate).toLocaleDateString()}</div>
                      <Badge
                        className={
                          schedule.status === "overdue" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }
                      >
                        {schedule.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
