"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewWorkOrderPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "city_management",
    workType: "maintenance",
    priority: "medium",
    location: "",
    estimatedHours: "",
    estimatedCost: "",
    assignedDepartment: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating work order:", formData)
    // TODO: Submit to API
  }

  return (
    <>
      <AppHeader />
      <PageContainer title="Create Work Order" description="Create a new operational task or maintenance work order">
        <div className="space-y-6">
          <Link href="/erp/work-orders">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Work Orders
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Work Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Water Pump Maintenance"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department *</label>
                    <select
                      name="assignedDepartment"
                      value={formData.assignedDepartment}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Parks">Parks & Recreation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the work to be performed"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Module</label>
                    <select
                      name="module"
                      value={formData.module}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    >
                      <option value="city_management">City Management</option>
                      <option value="traffic">Traffic & Mobility</option>
                      <option value="energy">Energy & Utilities</option>
                      <option value="waste">Waste Management</option>
                      <option value="services">Citizen Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Work Type</label>
                    <select
                      name="workType"
                      value={formData.workType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    >
                      <option value="maintenance">Maintenance</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                      <option value="installation">Installation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Est. Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      value={formData.estimatedHours}
                      onChange={handleChange}
                      placeholder="e.g., 4"
                      step="0.5"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Est. Cost ($)</label>
                    <input
                      type="number"
                      name="estimatedCost"
                      value={formData.estimatedCost}
                      onChange={handleChange}
                      placeholder="e.g., 1500"
                      step="100"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Central Water Station, Zone 5"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="gap-2">
                    Create Work Order
                  </Button>
                  <Link href="/erp/work-orders">
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
