"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

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
]

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  under_maintenance: "bg-yellow-100 text-yellow-800",
  decommissioned: "bg-red-100 text-red-800",
}

export default function AssetDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const asset = assetsData.find((a) => a.id === id)

  if (!asset) {
    return (
      <>
        <AppHeader />
        <PageContainer title="Asset Not Found">
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <p>The requested asset could not be found.</p>
            </CardContent>
          </Card>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <PageContainer title={asset.code}>
        <div className="space-y-6">
          <Link href="/erp/assets">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Assets
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{asset.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{asset.location}</p>
                </div>
                <Badge className={statusColors[asset.status]}>{asset.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-semibold capitalize">{asset.type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-semibold capitalize">{asset.category.replace("_", " ")}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Purchase Date</div>
                  <div className="font-semibold">{new Date(asset.purchaseDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold">{asset.location}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Financial Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Purchase Cost</div>
                    <div className="font-semibold">${asset.purchaseCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Value</div>
                    <div className="font-semibold">${asset.currentValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Depreciation</div>
                    <div className="font-semibold">${(asset.purchaseCost - asset.currentValue).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Maintenance Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Last Maintenance</div>
                    <div className="font-semibold">{new Date(asset.lastMaintenance).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Next Maintenance</div>
                    <div className="font-semibold">{new Date(asset.nextMaintenance).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Interval</div>
                    <div className="font-semibold">{asset.maintenanceInterval} days</div>
                  </div>
                </div>
              </div>

              {asset.operatingHours && (
                <div className="border-t pt-4">
                  <div className="text-sm text-muted-foreground">Operating Hours</div>
                  <div className="font-semibold text-lg">{asset.operatingHours.toLocaleString()}h</div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button>Schedule Maintenance</Button>
                <Button variant="outline">Edit Asset</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
