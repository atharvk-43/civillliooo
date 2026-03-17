"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  BarChart3,
  Wrench,
  Zap,
  Newspaper,
  LogOut,
  Home,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Settings,
  Menu,
  X,
} from "lucide-react"

interface UserInfo {
  userId: string
  name: string
  email: string
}

interface DashboardSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  features: string[]
}

export function UnifiedDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get user info from cookie
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("civilio-user="))
      ?.split("=")[1]

    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        setUserInfo(user)
      } catch (error) {
        console.error("[v0] Error parsing user cookie:", error)
      }
    }

    setLoading(false)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/auth/login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
      router.push("/auth/login")
    }
  }

  const sections: DashboardSection[] = [
    {
      id: "grievances",
      title: "Grievance Management",
      description: "Submit, track, and manage civic issues",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-blue-50 dark:bg-blue-950/30",
      features: ["Submit Grievances", "Track Status", "View History", "Add Comments"],
    },
    {
      id: "civil-points",
      title: "Civil Points & Rankings",
      description: "Track civic participation and achievements",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-yellow-50 dark:bg-yellow-950/30",
      features: ["View Points", "See Rankings", "Leaderboards", "Achievements"],
    },
    {
      id: "newsletter",
      title: "News & Announcements",
      description: "Stay updated on community issues and solutions",
      icon: <Newspaper className="h-6 w-6" />,
      color: "bg-purple-50 dark:bg-purple-950/30",
      features: ["Read News", "Featured Citizens", "Impact Stories", "Notifications"],
    },
    {
      id: "work-orders",
      title: "Work Orders",
      description: "Manage and track municipal work",
      icon: <Wrench className="h-6 w-6" />,
      color: "bg-orange-50 dark:bg-orange-950/30",
      features: ["View Orders", "Update Status", "Submit Reports", "Track Progress"],
    },
    {
      id: "analytics",
      title: "Analytics & Reports",
      description: "View performance metrics and statistics",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-green-50 dark:bg-green-950/30",
      features: ["Dashboards", "Reports", "Trends", "Insights"],
    },
    {
      id: "governance",
      title: "Governance & Administration",
      description: "Access administrative features and controls",
      icon: <Home className="h-6 w-6" />,
      color: "bg-indigo-50 dark:bg-indigo-950/30",
      features: ["Admin Controls", "User Management", "Settings", "Approvals"],
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-8">
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Civilio Portal</h1>
              <p className="text-xs text-muted-foreground">Unified Civic Engagement Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{userInfo?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 border-r border-border bg-muted/30 p-4 space-y-2 fixed md:relative h-[calc(100vh-70px)] md:h-auto overflow-y-auto`}
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-3">
              Navigation
            </p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveTab(section.id)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Welcome to Civilio, {userInfo?.name || "Citizen"}!</CardTitle>
                  <CardDescription>
                    Access all civic engagement features in one unified platform
                  </CardDescription>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
              </div>
            </CardHeader>
          </Card>

          {/* Content Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <Card
                key={section.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeTab === section.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveTab(section.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-lg ${section.color}`}>{section.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{section.features.length} features</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {section.features.map((feature) => (
                      <div
                        key={feature}
                        className="bg-muted rounded-lg p-3 text-xs font-medium text-center text-foreground hover:bg-primary/10 transition-colors"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
              <CardDescription>Your civic engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Grievances
                  </div>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Resolved
                  </div>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Civil Points
                  </div>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                    Active Tasks
                  </div>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                  <p className="font-semibold">Universal Access Enabled</p>
                  <p>
                    You now have access to all features of the Civilio platform. Use the navigation menu to explore different sections and engage with your community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
