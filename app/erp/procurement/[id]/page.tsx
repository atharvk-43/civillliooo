"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const purchaseOrdersData = [
  {
    id: 1,
    poNumber: "PO-2024-001",
    vendor: "TechSupply Industries",
    vendorCode: "TS-001",
    description: "Traffic signal controller units (12 units)",
    quantity: 12,
    unitPrice: 850,
    totalAmount: 10200,
    status: "sent",
    priority: "high",
    orderDate: "2024-01-10",
    deliveryDate: "2024-02-10",
    paymentStatus: "pending",
    budgetCode: "TRN-001",
  },
]

const poStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  approved: "bg-blue-100 text-blue-800",
  sent: "bg-cyan-100 text-cyan-800",
  received: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
}

export default function ProcurementDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const po = purchaseOrdersData.find((p) => p.id === id)

  if (!po) {
    return (
      <>
        <AppHeader />
        <PageContainer title="Purchase Order Not Found">
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <p>The requested purchase order could not be found.</p>
            </CardContent>
          </Card>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <PageContainer title={po.poNumber}>
        <div className="space-y-6">
          <Link href="/erp/procurement">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Procurement
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{po.vendor}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{po.description}</p>
                </div>
                <Badge className={poStatusColors[po.status]}>
                  {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Vendor Code</div>
                  <div className="font-semibold">{po.vendorCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Priority</div>
                  <div className="font-semibold capitalize">{po.priority}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Budget Code</div>
                  <div className="font-semibold">{po.budgetCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Order Date</div>
                  <div className="font-semibold">{new Date(po.orderDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Order Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="font-semibold">{po.quantity} units</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Unit Price</div>
                    <div className="font-semibold">${po.unitPrice}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="font-semibold text-lg">${po.totalAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Expected Delivery</div>
                    <div className="font-semibold">{new Date(po.deliveryDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Payment Status</h3>
                <p className="text-sm text-muted-foreground">{po.paymentStatus}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Update Status</Button>
                <Button variant="outline">Edit PO</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
