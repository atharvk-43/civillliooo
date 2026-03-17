import { UniversalLoginForm } from "@/components/auth/universal-login-form"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Civilio Login - Universal Portal Access",
  description: "Login to Civilio with flexible authentication",
}

export default function UniversalLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Civilio</h1>
          <p className="text-muted-foreground">Universal Civic Engagement Platform</p>
        </div>

        {/* Login Form */}
        <UniversalLoginForm />

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Citizens</CardTitle>
              <CardDescription className="text-xs">Report issues & track status</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Leaders</CardTitle>
              <CardDescription className="text-xs">Manage governance</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Workers</CardTitle>
              <CardDescription className="text-xs">Track work orders</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>© 2026 Civilio - Smart City Governance Platform</p>
          <p>All users have universal access to the complete platform</p>
        </div>
      </div>
    </div>
  )
}
