"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewBudgetPage() {
  const [formData, setFormData] = useState({
    budgetCode: "",
    department: "",
    category: "operations",
    fiscalYear: new Date().getFullYear().toString(),
    allocatedAmount: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating budget:", formData)
  }

  return (
    <>
      <AppHeader />
      <PageContainer title="Create New Budget" description="Allocate budget to a department or project">
        <div className="space-y-6">
          <Link href="/erp/financial">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Financial
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Code *</label>
                    <input
                      type="text"
                      name="budgetCode"
                      value={formData.budgetCode}
                      onChange={handleChange}
                      placeholder="e.g., TRN-001"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    >
                      <option value="operations">Operations</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="capital">Capital</option>
                      <option value="emergency">Emergency Reserve</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fiscal Year</label>
                    <select
                      name="fiscalYear"
                      value={formData.fiscalYear}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Allocated Amount ($) *</label>
                  <input
                    type="number"
                    name="allocatedAmount"
                    value={formData.allocatedAmount}
                    onChange={handleChange}
                    placeholder="e.g., 2500000"
                    step="10000"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Budget allocation description and purpose"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Create Budget</Button>
                  <Link href="/erp/financial">
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
