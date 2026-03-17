"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewPurchaseOrderPage() {
  const [formData, setFormData] = useState({
    vendor: "",
    description: "",
    quantity: "",
    unitPrice: "",
    deliveryDate: "",
    budgetCode: "",
    priority: "medium",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating purchase order:", formData)
  }

  return (
    <>
      <AppHeader />
      <PageContainer title="Create Purchase Order" description="Create a new purchase order for procurement">
        <div className="space-y-6">
          <Link href="/erp/procurement">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Procurement
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Vendor *</label>
                    <select
                      name="vendor"
                      value={formData.vendor}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    >
                      <option value="">Select Vendor</option>
                      <option value="TechSupply Industries">TechSupply Industries</option>
                      <option value="Green Energy Solutions">Green Energy Solutions</option>
                      <option value="Municipal Supplies Co">Municipal Supplies Co</option>
                      <option value="Infrastructure Repair Ltd">Infrastructure Repair Ltd</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Code *</label>
                    <select
                      name="budgetCode"
                      value={formData.budgetCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    >
                      <option value="">Select Budget</option>
                      <option value="TRN-001">Transportation (TRN-001)</option>
                      <option value="UTL-001">Utilities (UTL-001)</option>
                      <option value="SAN-001">Sanitation (SAN-001)</option>
                      <option value="INF-001">Infrastructure (INF-001)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Item description and specifications"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 50"
                      step="1"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Unit Price ($) *</label>
                    <input
                      type="number"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      placeholder="e.g., 150"
                      step="0.01"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Date *</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Create Purchase Order</Button>
                  <Link href="/erp/procurement">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
