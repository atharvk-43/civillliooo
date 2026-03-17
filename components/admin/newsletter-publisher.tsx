"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, CheckCircle, Newspaper, Loader } from "lucide-react"

interface NewsletterForm {
  title: string
  content: string
  category: string
  author_name: string
  thumbnail_url: string
  is_featured: boolean
}

export function NewsletterPublisher() {
  const [form, setForm] = useState<NewsletterForm>({
    title: "",
    content: "",
    category: "general",
    author_name: "",
    thumbnail_url: "",
    is_featured: false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [charCount, setCharCount] = useState(0)

  const handleContentChange = (value: string) => {
    setForm({ ...form, content: value })
    setCharCount(value.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: form.is_featured ? "published" : "draft",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Newsletter published successfully!" })
        setForm({
          title: "",
          content: "",
          category: "general",
          author_name: "",
          thumbnail_url: "",
          is_featured: false,
        })
        setCharCount(0)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to publish newsletter" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error publishing newsletter" })
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <Newspaper className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Newsletter Publisher</h2>
        </div>
        <p className="text-muted-foreground">Create and publish updates to engage citizens and highlight community achievements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publish New Newsletter</CardTitle>
          <CardDescription>Share updates about city initiatives and featured citizen stories</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Messages */}
            {message && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
                    : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
                <p
                  className={`text-sm ${
                    message.type === "success"
                      ? "text-green-800 dark:text-green-100"
                      : "text-red-800 dark:text-red-100"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold">
                Newsletter Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., 'Monthly Infrastructure Update' or 'Citizen Hero Feature'"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold">
                  Category
                </Label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Update</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="health">Health & Sanitation</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="water">Water & Sewage</SelectItem>
                    <SelectItem value="governance">Governance</SelectItem>
                    <SelectItem value="citizen-feature">Citizen Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="font-semibold">
                  Author Name
                </Label>
                <Input
                  id="author"
                  placeholder="Your name"
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="font-semibold">
                  Content <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">{charCount} characters</span>
              </div>
              <Textarea
                id="content"
                placeholder="Write your newsletter content here. Share updates, achievements, and citizen stories..."
                value={form.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={8}
                required
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="font-semibold">
                Thumbnail Image URL
              </Label>
              <Input
                id="thumbnail"
                placeholder="https://example.com/image.jpg"
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              />
              {form.thumbnail_url && (
                <img
                  src={form.thumbnail_url}
                  alt="Preview"
                  className="h-32 w-48 object-cover rounded-md mt-2"
                />
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="featured" className="cursor-pointer font-semibold">
                Feature this newsletter on homepage
              </Label>
            </div>

            {/* Preview */}
            {form.title && form.content && (
              <Card className="bg-muted/50 border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <h3 className="font-semibold text-foreground">{form.title}</h3>
                  {form.category && (
                    <Badge variant="secondary" className="w-fit capitalize">
                      {form.category}
                    </Badge>
                  )}
                  <p className="text-muted-foreground line-clamp-3">{form.content}</p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !form.title || !form.content}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Newspaper className="h-4 w-4" />
                    Publish Newsletter
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm({
                    title: "",
                    content: "",
                    category: "general",
                    author_name: "",
                    thumbnail_url: "",
                    is_featured: false,
                  })
                  setCharCount(0)
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-base text-blue-900 dark:text-blue-100">Tips for Effective Newsletters</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>• Highlight citizen stories to inspire civic participation and recognize contributions</p>
          <p>• Share before/after photos to demonstrate government action and responsiveness</p>
          <p>• Include specific metrics on problems resolved and impact on citizens</p>
          <p>• Feature responsible citizens to motivate others to contribute</p>
          <p>• Use clear, engaging language that explains government actions in simple terms</p>
        </CardContent>
      </Card>
    </div>
  )
}
