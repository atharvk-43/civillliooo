"use client"

import React from "react"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"

interface AssignWorkOrderFormData {
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  location: string
  estimatedHours: string
  estimatedCost: string
  assignToVendor: string
}

interface Vendor {
  id: number
  vendor_name: string
  category: string
  rating: number
}

export default function AssignWorkOrder() {
  const { role } = useUser()
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role !== "citizen-leader") {
      router.push("/login")
      return
    }
    fetchVendors()
  }, [role, router])

  const fetchVendors = async () => {
    // Mock vendors data
    const mockVendors: Vendor[] = [
      { id: 1, vendor_name: "ABC Construction & Maintenance", category: "maintenance", rating: 4.8 },
      { id: 2, vendor_name: "XYZ Infrastructure Services", category: "services", rating: 4.5 },
      { id: 3, vendor_name: "Urban Solutions Ltd", category: "maintenance", rating: 4.9 },
      { id: 4, vendor_name: "City Works Co.", category: "services", rating: 4.3 },
      { id: 5, vendor_name: "Prime Maintenance Group", category: "maintenance", rating: 4.7 },
    ]
    setVendors(mockVendors)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setLoading(false)

    // Reset form after 2 seconds
    setTimeout(() => {
      router.push("/citizen-leader/dashboard")
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Work Order Assigned!</h2>
          <p className="text-muted-foreground mb-6">
            The work order has been successfully assigned to the vendor. They have 7 days to complete or revert
            with a report.
          </p>
          <Button onClick={() => router.push("/citizen-leader/dashboard")} className="w-full">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Assign Work Order</h1>
              <p className="text-muted-foreground mt-1">Create and assign a new task to a vendor/worker</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Work Order Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Pothole Repair on Main Street"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <Textarea
                    placeholder="Detailed description of the work to be completed..."
                    required
                    rows={5}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority *</label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
                    <Input
                      type="text"
                      placeholder="e.g., Vijay Nagar, Indore"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Work Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Work Specifications</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Estimated Hours *</label>
                    <Input type="number" placeholder="8" required min="1" className="w-full" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Estimated Cost (₹) *</label>
                    <Input type="number" placeholder="5000" required min="0" className="w-full" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Vendor Assignment */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Assign to Vendor/Worker</h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">Select Vendor *</label>
                <div className="space-y-3">
                  {vendors.map((vendor) => (
                    <label key={vendor.id} className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer">
                      <input type="radio" name="vendor" value={vendor.id} required className="w-4 h-4" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{vendor.vendor_name}</p>
                        <p className="text-sm text-muted-foreground">{vendor.category}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        ⭐ {vendor.rating}
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            {/* Important Notice */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Important: Response Deadline</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>✓ Assigned workers have 7 days to complete the work order</li>
                <li>✓ They must either complete the task or submit a detailed report explaining the delay</li>
                <li>✓ Late submissions will impact their vendor rating</li>
                <li>✓ You will receive notifications when the work is completed</li>
              </ul>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end">
              <Button onClick={() => router.back()} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? "Assigning..." : "Assign Work Order"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
