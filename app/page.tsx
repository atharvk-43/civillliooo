"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { ModuleGrid } from "@/components/dashboard/module-grid"
import { SystemStatus } from "@/components/dashboard/system-status"

export default function HomePage() {
  const { role } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!role) {
      router.push("/login")
    } else if (role === "citizen-leader") {
      router.push("/citizen-leader/dashboard")
    }
  }, [role, router])

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
