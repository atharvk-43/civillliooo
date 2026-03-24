"use client"

import { useState, useEffect, useCallback } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { GrievanceForm } from "@/components/grievances/grievance-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, RefreshCw, Loader2, MapPin, User, Hash } from "lucide-react"
import { supabase } from "@/lib/supabase"

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", icon: RefreshCw },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", icon: AlertCircle },
}

const priorityConfig = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  critical: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
}

export default function GrievancesPage() {
  const [activeTab, setActiveTab] = useState("submit")
  const [grievances, setGrievances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // ── Fetch all grievances from Supabase ──────────────────────────────────────
  const fetchGrievances = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/grievances?limit=50")
      const json = await res.json()
      if (json.success) setGrievances(json.data ?? [])
    } catch {
      setErrorMsg("Failed to load grievances. Please refresh.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGrievances()

    // ── Real-time Supabase subscription ────────────────────────────────────────
    const channel = supabase
      .channel("grievances-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "grievances" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setGrievances(prev => [payload.new, ...prev])
        } else if (payload.eventType === "UPDATE") {
          setGrievances(prev => prev.map(g => g.id === payload.new.id ? payload.new : g))
        } else if (payload.eventType === "DELETE") {
          setGrievances(prev => prev.filter(g => g.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchGrievances])

  // ── Submit new grievance ────────────────────────────────────────────────────
  const handleSubmit = async (formData: any) => {
    setSubmitting(true)
    setErrorMsg("")
    setSuccessMsg("")
    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.issueType || formData.title,
          description: formData.description,
          category: mapCategory(formData.issueType || formData.category),
          priority: formData.priority || "medium",
          location: formData.location,
          ward: formData.ward,
          pincode: formData.pincode,
          complainant_name: formData.name || formData.complainant_name,
          complainant_email: formData.email || formData.complainant_email,
          complainant_phone: formData.phone || formData.complainant_phone,
        })
      })
      const json = await res.json()
      if (json.success) {
        setSuccessMsg(`✅ Grievance submitted! Tracking ID: ${json.data.tracking_id}`)
        setActiveTab("track")
      } else {
        setErrorMsg(json.error || "Submission failed. Please try again.")
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <AppHeader />
      <PageContainer>
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Citizen Grievance Portal</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Submit complaints about city services and infrastructure. Track real-time status updates powered by live database.
                </p>
              </div>
              <button onClick={fetchGrievances} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Live stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total", value: grievances.length, color: "text-foreground" },
              { label: "Pending", value: grievances.filter(g => g.status === "pending").length, color: "text-yellow-600" },
              { label: "In Progress", value: grievances.filter(g => g.status === "in_progress").length, color: "text-blue-600" },
              { label: "Resolved", value: grievances.filter(g => g.status === "resolved").length, color: "text-green-600" },
            ].map(stat => (
              <Card key={stat.label} className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Success/Error banners */}
          {successMsg && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-900 dark:text-green-100 font-medium">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900 dark:text-red-100">{errorMsg}</p>
            </div>
          )}

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">🔴 Live Data — Powered by Supabase</p>
              <p>All grievances are stored in a real database. Status updates reflect instantly across all users.</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="submit">Submit Grievance</TabsTrigger>
              <TabsTrigger value="track">
                Track Status
                {grievances.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 text-xs">{grievances.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Submit Tab */}
            <TabsContent value="submit">
              <GrievanceForm onSubmit={handleSubmit} />
              {submitting && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting to database...
                </div>
              )}
            </TabsContent>

            {/* Track Tab */}
            <TabsContent value="track">
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading live grievances...
                </div>
              ) : grievances.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-2">No grievances in the database yet</p>
                  <p className="text-sm text-muted-foreground">Submit your first grievance to see it appear here in real-time</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {grievances.map((g) => {
                    const sc = statusConfig[g.status as keyof typeof statusConfig] ?? statusConfig.pending
                    const pc = priorityConfig[g.priority as keyof typeof priorityConfig] ?? priorityConfig.medium
                    const StatusIcon = sc.icon
                    return (
                      <Card key={g.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-base font-semibold text-foreground truncate">{g.title}</h3>
                              <Badge className={`flex items-center gap-1 text-xs ${sc.color}`} variant="secondary">
                                <StatusIcon className="h-3 w-3" />{sc.label}
                              </Badge>
                              <Badge className={`text-xs ${pc}`} variant="secondary">
                                {g.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{g.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">{g.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 shrink-0" />
                                <span className="truncate">{g.complainant_name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Hash className="h-3 w-3 shrink-0" />
                                <span className="font-mono">{g.tracking_id}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3 shrink-0" />
                                <span>{new Date(g.created_at).toLocaleDateString("en-IN")}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded capitalize shrink-0">
                            {g.category?.replace("_", " ")}
                          </span>
                        </div>
                        {g.resolution_notes && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground"><span className="font-medium">Resolution: </span>{g.resolution_notes}</p>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  )
}

// ── Map form issue type to DB category ─────────────────────────────────────────
function mapCategory(issueType: string): string {
  const map: Record<string, string> = {
    "Pothole Damage": "roads", "Road Damage": "roads", "Road": "roads",
    "Street Lighting": "electricity", "Electricity": "electricity",
    "Water Supply": "water", "Water": "water",
    "Sanitation": "sanitation", "Garbage": "sanitation", "Waste": "sanitation",
    "Public Safety": "public_safety", "Safety": "public_safety",
    "Parks": "parks", "Park": "parks",
    "Permits": "permits", "Construction": "permits",
    "Noise": "noise",
  }
  for (const key of Object.keys(map)) {
    if (issueType?.toLowerCase().includes(key.toLowerCase())) return map[key]
  }
  return "other"
}
