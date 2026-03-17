import { SessionGuard } from "@/components/auth/session-guard"
import { UnifiedDashboard } from "@/components/dashboard/unified-dashboard"

export const metadata = {
  title: "Civilio Dashboard - Unified Portal",
  description: "Access all civic engagement features in one unified platform",
}

export default function DashboardPage() {
  return (
    <SessionGuard>
      <UnifiedDashboard />
    </SessionGuard>
  )
}
