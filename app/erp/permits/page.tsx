"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter } from "lucide-react"

// Mock permits data
const permitsData = [
  {
    id: 1,
    number: "PERMIT-2024-001",
    type: "building",
    citizenName: "Rajesh Khanna",
    email: "rajesh@example.com",
    address: "Plot 45, Vijay Nagar",
    zone: "Zone A",
    description: "Foundation inspection for new office building",
    status: "approved",
    applicationDate: "2024-01-05",
    approvalDate: "2024-01-15",
    expiryDate: "2024-07-15",
    feeAmount: 10850,
    paymentStatus: "completed",
    assignedTo: "Vikram Singh",
  },
  {
    id: 2,
    number: "PERMIT-2024-002",
    type: "trade",
    citizenName: "Sharma Plumbing Services",
    email: "contact@sharmaplumbing.com",
    address: "456 Navlakha",
    zone: "Zone B",
    description: "Plumbing contractor license renewal",
    status: "under_review",
    applicationDate: "2024-01-12",
    approvalDate: null,
    expiryDate: "2025-01-12",
    feeAmount: 6510,
    paymentStatus: "completed",
    assignedTo: "Neha Patel",
  },
  {
    id: 3,
    number: "PERMIT-2024-003",
    type: "event",
    citizenName: "Indore Community Center",
    email: "events@indorecenter.gov",
    address: "Azad Nagar Park",
    zone: "Zone C",
    description: "Annual Spring Festival - Street closure and event permit",
    status: "approved",
    applicationDate: "2024-01-08",
    approvalDate: "2024-01-18",
    expiryDate: "2024-04-20",
    feeAmount: 26130,
    paymentStatus: "completed",
    assignedTo: "Rajesh Kumar",
  },
  {
    id: 4,
    number: "PERMIT-2024-004",
    type: "vendor",
    citizenName: "Malviya Nagar Food Vendors",
    email: "ops@foodvendors.com",
    address: "Mobile - Multiple Zones",
    zone: "Multiple Zones",
    description: "Mobile food vendor license for city-wide operation",
    status: "submitted",
    applicationDate: "2024-01-16",
    approvalDate: null,
    expiryDate: null,
    feeAmount: 13050,
    paymentStatus: "pending",
    assignedTo: null,
  },
  {
    id: 5,
    number: "PERMIT-2024-005",
    type: "building",
    citizenName: "Super Corridor Development Corp",
    email: "permits@scdev.com",
    address: "Super Corridor, Indore",
    zone: "Zone A",
    description: "Commercial renovation - electrical and structural work",
    status: "rejected",
    applicationDate: "2024-01-10",
    approvalDate: null,
    rejectionReason: "Does not meet current zoning regulations",
    expiryDate: null,
    feeAmount: 32650,
    paymentStatus: "refunded",
    assignedTo: "Anjali Singh",
  },
]

const licensesData = [
  {
    id: 1,
    number: "LIC-2024-001",
    type: "business",
    businessName: "Green Market Indore",
    ownerName: "Meera Singh",
    category: "Retail",
    issueDate: "2023-06-01",
    expiryDate: "2024-06-01",
    status: "expired",
    renewalDate: "2024-06-15",
    feeAmount: 8700,
  },
  {
    id: 2,
    number: "LIC-2024-002",
    type: "professional",
    businessName: "Indore Architecture Group",
    ownerName: "Dr. Arun Mishra",
    category: "Engineering/Architecture",
    issueDate: "2023-03-15",
    expiryDate: "2025-03-15",
    status: "active",
    renewalDate: null,
    feeAmount: 16350,
  },
  {
    id: 3,
    number: "LIC-2024-003",
    type: "business",
    businessName: "Palasia Cafe",
    ownerName: "Deepika Gupta",
    category: "Food Service",
    issueDate: "2024-01-10",
    expiryDate: "2025-01-10",
    status: "active",
    renewalDate: null,
    feeAmount: 11960,
  },
]

const permStatusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-cyan-100 text-cyan-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
}

const licenseStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  suspended: "bg-yellow-100 text-yellow-800",
}

export default function PermitsPage() {
  const [activeTab, setActiveTab] = useState<"permits" | "licenses">("permits")
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
  })

  const filteredPermits = permitsData.filter((permit) => {
    if (filters.status !== "all" && permit.status !== filters.status) return false
    if (filters.type !== "all" && permit.type !== filters.type) return false
    return true
  })

  const permitStats = {
    total: permitsData.length,
    pending: permitsData.filter((p) => p.status === "submitted" || p.status === "under_review").length,
    approved: permitsData.filter((p) => p.status === "approved").length,
    rejected: permitsData.filter((p) => p.status === "rejected").length,
  }

  return (
    <>
      <AppHeader />
      <PageContainer
        title="Permits & Licensing"
        description="Manage citizen permits, business licenses, and regulatory compliance"
      >
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{permitStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Permits</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan-600">{permitStats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{permitStats.approved}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{permitStats.rejected}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Rejected</div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("permits")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === "permits"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Permits
            </button>
            <button
              onClick={() => setActiveTab("licenses")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === "licenses"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Licenses
            </button>
          </div>

          {/* Permits Tab */}
          {activeTab === "permits" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="building">Building</option>
                    <option value="trade">Trade</option>
                    <option value="event">Event</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Permit Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPermits.map((permit) => (
                      <Link key={permit.id} href={`/erp/permits/${permit.id}`}>
                        <div className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {permit.number}: {permit.citizenName}
                              </h3>
                              <p className="text-sm text-muted-foreground">{permit.description}</p>
                            </div>
                            <Badge className={permStatusColors[permit.status]}>{permit.status.replace("_", " ")}</Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                            <div>
                              <div className="text-muted-foreground">Type</div>
                              <div className="font-medium capitalize">{permit.type}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Zone</div>
                              <div className="font-medium">{permit.zone}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Fee</div>
                              <div className="font-medium">₹{permit.feeAmount.toLocaleString("en-IN")}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Applied</div>
                              <div className="font-medium">
                                {new Date(permit.applicationDate).toLocaleDateString("en-IN")}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Assigned To</div>
                              <div className="font-medium">{permit.assignedTo || "Unassigned"}</div>
                            </div>
                          </div>

                          {permit.expiryDate && (
                            <div className="pt-3 border-t border-border">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Expires: {new Date(permit.expiryDate).toLocaleDateString("en-IN")}
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Licenses Tab */}
          {activeTab === "licenses" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business & Professional Licenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {licensesData.map((license) => (
                      <div
                        key={license.id}
                        className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {license.number}: {license.businessName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{license.ownerName}</p>
                          </div>
                          <Badge className={licenseStatusColors[license.status]}>
                            {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Type</div>
                            <div className="font-medium capitalize">{license.type}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Category</div>
                            <div className="font-medium">{license.category}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Issue Date</div>
                            <div className="font-medium">{new Date(license.issueDate).toLocaleDateString("en-IN")}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Expiry Date</div>
                            <div className="font-medium">
                              {new Date(license.expiryDate).toLocaleDateString("en-IN")}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Fee Amount</div>
                            <div className="font-medium">₹{license.feeAmount.toLocaleString("en-IN")}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  )
}
