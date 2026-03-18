"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { ModuleGrid } from "@/components/dashboard/module-grid"
import { SystemStatus } from "@/components/dashboard/system-status"

export default function HomePage() {
  const { role } = useUser()
  const router = useRouter()

  // Memoize the effect dependency to prevent unnecessary redirects
  const shouldRedirect = useMemo(() => {
    if (!role) return "login"
    if (role === "citizen-leader") return "citizen-leader"
    return null
  }, [role])

  useEffect(() => {
    if (shouldRedirect === "login") {
      router.push("/login")
    } else if (shouldRedirect === "citizen-leader") {
      router.push("/citizen-leader/dashboard")
    }
  }, [shouldRedirect, router])

  // Show dashboard only for non-logged-in state or while checking auth
  if (!role || role === "citizen-leader") {
    return null
  }

  return (
    <>
      <AppHeader />
      <PageContainer
        title="City Operations Dashboard"
        description="Real-time monitoring and management of city services and infrastructure"
      >
        <div className="space-y-8">
          <SystemStatus />
          <ModuleGrid />
        </div>
      </PageContainer>
    </>
  )
}
