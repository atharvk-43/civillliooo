"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle } from "lucide-react"

interface GrievanceFormProps {
  onSubmit?: (data: any) => void
}

const issueTypes = [
  "Road & Infrastructure",
  "Water Supply",
  "Street Lighting",
  "Waste Management",
  "Traffic & Parking",
  "Public Health",
  "Utilities",
  "Noise Pollution",
  "Building Permit",
  "Other",
]

const zones = ["Downtown", "North Zone", "South Zone", "East Zone", "West Zone"]

export function GrievanceForm({ onSubmit }: GrievanceFormProps) {
  const [formData, setFormData] = useState({
    citizenName: "",
    email: "",
    phone: "",
    category: "",
    description: "",
    location: "",
    zone: "",
    priority: "medium",
    attachment: null as File | null,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [grievanceId, setGrievanceId] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.citizenName.trim()) newErrors.citizenName = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.category) newErrors.category = "Issue type is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.zone) newErrors.zone = "Zone is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setGrievanceId(result.data.id)
        setSubmitted(true)
        
        // Call optional callback
        if (onSubmit) {
          onSubmit(result.data)
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false)
          setGrievanceId(null)
          setFormData({
            citizenName: "",
            email: "",
            phone: "",
            category: "",
            description: "",
            location: "",
            zone: "",
            priority: "medium",
            attachment: null,
          })
        }, 3000)
      } else {
        setErrors({ submit: result.error || "Failed to submit grievance" })
      }
    } catch (error) {
      setErrors({ submit: "Error submitting form. Please try again." })
      console.error("[v0] Grievance submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Grievance Submitted Successfully</h3>
        {grievanceId && (
          <p className="text-green-800 dark:text-green-200 mb-2 font-mono">
            <strong>Grievance ID: {grievanceId}</strong>
          </p>
        )}
        <p className="text-green-800 dark:text-green-200 mb-4">
          Thank you for submitting your complaint. A confirmation email has been sent to your email address with tracking details.
        </p>
        <p className="text-sm text-green-700 dark:text-green-300">
          You can track the progress on your dashboard anytime.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Your name"
            value={formData.citizenName}
            onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
            className={errors.citizenName ? "border-destructive" : ""}
          />
          {errors.citizenName && <p className="text-xs text-destructive">{errors.citizenName}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Email Address <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <Input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        {/* Issue Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Issue Category <span className="text-destructive">*</span>
          </label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className={errors.category ? "border-destructive" : ""}>
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              {issueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>
      </div>

      {/* Location Fields */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Detailed Location <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="Street name, landmarks, or specific address"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className={errors.location ? "border-destructive" : ""}
        />
        {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Zone <span className="text-destructive">*</span>
        </label>
        <Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
          <SelectTrigger className={errors.zone ? "border-destructive" : ""}>
            <SelectValue placeholder="Select zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.zone && <p className="text-xs text-destructive">{errors.zone}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          placeholder="Provide detailed description of the issue. Include when you first noticed it and any impact it has caused."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`min-h-28 ${errors.description ? "border-destructive" : ""}`}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Attachment (Optional)</label>
        <label className="flex items-center justify-center gap-3 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-accent hover:bg-muted/50 transition-colors">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Click to upload photo or document (max 5MB)</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                if (e.target.files[0].size <= 5 * 1024 * 1024) {
                  setFormData({ ...formData, attachment: e.target.files[0] })
                }
              }
            }}
          />
        </label>
        {formData.attachment && <p className="text-xs text-muted-foreground">Selected: {formData.attachment.name}</p>}
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-6 border-t border-border flex gap-3 justify-end">
        <Button variant="outline" type="reset" disabled={loading}>
          Clear
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
          {loading ? "Submitting..." : "Submit Grievance"}
        </Button>
      </div>
    </form>
  )
}
