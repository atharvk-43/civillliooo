"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

interface FeedbackFormProps {
  onSubmit?: (data: any) => void
}

const feedbackCategories = [
  "Website Usability",
  "Feature Request",
  "Performance Issue",
  "Bug Report",
  "Design Feedback",
  "Other",
]

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      if (onSubmit) onSubmit(formData)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: "",
          email: "",
          category: "",
          subject: "",
          message: "",
        })
      }, 2000)
    } else {
      setErrors(newErrors)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Feedback Submitted</h3>
        <p className="text-green-800 dark:text-green-200">
          Thank you for your feedback. We appreciate your input to improve our platform.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Feedback Category <span className="text-destructive">*</span>
        </label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className={errors.category ? "border-destructive" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {feedbackCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Subject <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="Brief subject of your feedback"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className={errors.subject ? "border-destructive" : ""}
        />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Message <span className="text-destructive">*</span>
        </label>
        <Textarea
          placeholder="Detailed feedback or description of the issue"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`min-h-28 ${errors.message ? "border-destructive" : ""}`}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <div className="pt-6 border-t border-border flex gap-3 justify-end">
        <Button variant="outline" type="reset">
          Clear
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Submit Feedback
        </Button>
      </div>
    </form>
  )
}
