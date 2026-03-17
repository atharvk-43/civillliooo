"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, Plus } from "lucide-react"

// Mock purchase orders data
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
  {
    id: 2,
    poNumber: "PO-2024-002",
    vendor: "Green Energy Solutions",
    vendorCode: "GES-001",
    description: "Water treatment chemicals (monthly supply)",
    quantity: 500,
    unitPrice: 45,
    totalAmount: 22500,
    status: "received",
    priority: "medium",
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-28",
    receivedDate: "2024-01-27",
    paymentStatus: "pending",
    budgetCode: "UTL-001",
  },
  {
    id: 3,
    poNumber: "PO-2024-003",
    vendor: "Municipal Supplies Co",
    vendorCode: "MSC-001",
    description: "Street cleaning equipment - brooms, shovels",
    quantity: 100,
    unitPrice: 75,
    totalAmount: 7500,
    status: "draft",
    priority: "low",
    orderDate: "2024-01-15",
    deliveryDate: "2024-02-15",
    paymentStatus: "draft",
    budgetCode: "SAN-001",
  },
  {
    id: 4,
    poNumber: "PO-2024-004",
    vendor: "Infrastructure Repair Ltd",
    vendorCode: "IRL-001",
    description: "Road asphalt repair materials",
    quantity: 50,
    unitPrice: 120,
    totalAmount: 6000,
    status: "approved",
    priority: "high",
    orderDate: "2024-01-16",
    deliveryDate: "2024-02-05",
    paymentStatus: "pending",
    budgetCode: "INF-001",
  },
]

const vendorsData = [
  {
    id: 1,
    code: "TS-001",
    name: "TechSupply Industries",
    category: "Equipment",
    status: "active",
    rating: 4.5,
    totalSpent: 145000,
    contactPerson: "John Smith",
    email: "john@techsupply.com",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    code: "GES-001",
    name: "Green Energy Solutions",
    category: "Materials",
    status: "active",
    rating: 4.8,
    totalSpent: 89000,
    contactPerson: "Sarah Johnson",
    email: "sarah@greenergy.com",
    phone: "(555) 234-5678",
  },
  {
    id: 3,
    code: "MSC-001",
    name: "Municipal Supplies Co",
    category: "Supplies",
    status: "active",
    rating: 4.2,
    totalSpent: 52000,
    contactPerson: "Mike Davis",
    email: "mike@munsupplies.com",
    phone: "(555) 345-6789",
  },
  {
    id: 4,
    code: "IRL-001",
    name: "Infrastructure Repair Ltd",
    category: "Services",
    status: "active",
    rating: 4.6,
    totalSpent: 234000,
    contactPerson: "Emma Wilson",
    email: "emma@infrarepair.com",
    phone: "(555) 456-7890",
  },
]

const poStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  approved: "bg-blue-100 text-blue-800",
  sent: "bg-cyan-100 text-cyan-800",
  received: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
}

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "vendors">("orders")
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  })

  const filteredOrders = purchaseOrdersData.filter((order) => {
    if (filters.status !== "all" && order.status !== filters.status) return false
    if (filters.priority !== "all" && order.priority !== filters.priority) return false
    return true
  })

  const totalPOValue = purchaseOrdersData.reduce((sum, po) => sum + po.totalAmount, 0)
  const pendingPayment = purchaseOrdersData.filter((po) => po.paymentStatus === "pending").length
  const receivedOrders = purchaseOrdersData.filter((po) => po.status === "received" || po.status === "completed").length

  return (
    <>
      <AppHeader />
      <PageContainer
        title="Procurement & Vendor Management"
        description="Manage purchase orders, vendor relationships, and procurement workflows"
      >
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">${(totalPOValue / 1000).toFixed(0)}k</div>
                <div className="text-sm text-muted-foreground">Total PO Value</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{purchaseOrdersData.length}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{receivedOrders}</div>
                <div className="text-sm text-muted-foreground">Delivered/Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingPayment}</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Pending Payment</div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === "orders"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Purchase Orders
            </button>
            <button
              onClick={() => setActiveTab("vendors")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === "vendors"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Vendors
            </button>
          </div>

          {/* Purchase Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="sent">Sent</option>
                    <option value="received">Received</option>
                  </select>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Link href="/erp/procurement/new-po">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Purchase Order
                  </Button>
                </Link>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Link key={order.id} href={`/erp/procurement/${order.id}`}>
                        <div className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {order.poNumber}: {order.vendor}
                              </h3>
                              <p className="text-sm text-muted-foreground">{order.description}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={poStatusColors[order.status]}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Quantity</div>
                              <div className="font-medium">{order.quantity} units</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Unit Price</div>
                              <div className="font-medium">${order.unitPrice}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Total Amount</div>
                              <div className="font-semibold">${order.totalAmount.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Delivery</div>
                              <div className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Payment</div>
                              <div
                                className={`font-medium ${order.paymentStatus === "pending" ? "text-yellow-600" : ""}`}
                              >
                                {order.paymentStatus}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vendors Tab */}
          {activeTab === "vendors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-end gap-4">
                <Link href="/erp/procurement/new-vendor">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Vendor
                  </Button>
                </Link>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Registered Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendorsData.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {vendor.code}: {vendor.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{vendor.contactPerson}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{vendor.category}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                          <div>
                            <div className="text-muted-foreground">Email</div>
                            <div className="font-medium text-blue-600 text-xs">{vendor.email}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Phone</div>
                            <div className="font-medium">{vendor.phone}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Status</div>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">{vendor.status}</Badge>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Rating</div>
                            <div className="font-semibold flex items-center gap-1">
                              {vendor.rating}
                              <span className="text-yellow-500">★</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Total Spent</div>
                            <div className="font-semibold">${(vendor.totalSpent / 1000).toFixed(0)}k</div>
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
