"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const permitsData = [
  {
    id: 1,
    number: "PERMIT-2024-001",
    type: "building",
    citizenName: "John Anderson",
    email: "john@example.com",
    address: "123 Main Street",
    zone: "Zone A",
    description: "Foundation inspection for new office building",
    status: "approved",
    applicationDate: "2024-01-05",
    approvalDate: "2024-01-15",
    expiryDate: "2024-07-15",
    feeAmount: 500,
    paymentStatus: "completed",
    assignedTo: "Robert Wilson",
  },
]

const permStatusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-cyan-100 text-cyan-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
}

export default function PermitDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const permit = permitsData.find((p) => p.id === id)

  if (!permit) {
    return (
      <>
        <AppHeader />
        <PageContainer title="Permit Not Found">
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <p>The requested permit could not be found.</p>
            </CardContent>
          </Card>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <PageContainer title={permit.number}>
        <div className="space-y-6">
          <Link href="/erp/permits">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Permits
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{permit.citizenName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{permit.description}</p>
                </div>
                <Badge className={permStatusColors[permit.status]}>{permit.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-semibold capitalize">{permit.type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Zone</div>
                  <div className="font-semibold">{permit.zone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div className="font-semibold">{permit.address}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Applied Date</div>
                  <div className="font-semibold">{new Date(permit.applicationDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-semibold text-blue-600 text-sm">{permit.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fee Amount</div>
                    <div className="font-semibold">${permit.feeAmount}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Status Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Status</div>
                    <div className="font-semibold capitalize">{permit.paymentStatus}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Assigned To</div>
                    <div className="font-semibold">{permit.assignedTo || "Unassigned"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Expiry Date</div>
                    <div className="font-semibold">{new Date(permit.expiryDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Update Status</Button>
                <Button variant="outline">Send Notification</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
