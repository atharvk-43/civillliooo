"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewVendorPage() {
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorCode: "",
    category: "equipment",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "net30",
    taxId: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating vendor:", formData)
  }

  return (
    <>
      <AppHeader />
      <PageContainer title="Register New Vendor" description="Add a new vendor to the procurement system">
        <div className="space-y-6">
          <Link href="/erp/procurement">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Procurement
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Vendor Name *</label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleChange}
                      placeholder="Company name"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Vendor Code *</label>
                    <input
                      type="text"
                      name="vendorCode"
                      value={formData.vendorCode}
                      onChange={handleChange}
                      placeholder="e.g., VND-001"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="Primary contact name"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    >
                      <option value="equipment">Equipment</option>
                      <option value="materials">Materials</option>
                      <option value="supplies">Supplies</option>
                      <option value="services">Services</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vendor@company.com"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full vendor address"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Terms</label>
                    <select
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    >
                      <option value="net15">Net 15</option>
                      <option value="net30">Net 30</option>
                      <option value="net45">Net 45</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tax ID</label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="Tax ID number"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Register Vendor</Button>
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
