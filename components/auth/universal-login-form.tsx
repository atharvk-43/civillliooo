"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"

export function UniversalLoginForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [credential, setCredential] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/universal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Anonymous User",
          email: email.trim() || `user-${Date.now()}@civilio.local`,
          credential: credential.trim() || "DEFAULT",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/app/dashboard")
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 dark:border-green-900">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">Welcome to Civilio!</h3>
              <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Civilio Portal Access</CardTitle>
        <CardDescription>
          Login to access the complete civic engagement platform. All fields are optional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="credential" className="text-sm font-medium text-foreground">
              ID / Credential <span className="text-xs text-muted-foreground">(optional - Aadhar, PAN, Voter ID, Appointment ID, etc.)</span>
            </label>
            <Input
              id="credential"
              placeholder="Enter ID, Aadhar, PAN, Voter ID, or Appointment ID"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              disabled={loading}
              className="h-10"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 text-base font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Access Civilio Platform"
            )}
          </Button>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">How It Works:</p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• All fields are optional - enter any information or leave blank</li>
              <li>• Access complete platform features with flexible authentication</li>
              <li>• Submit grievances, track issues, and engage civically</li>
              <li>• Your data is secure and encrypted</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
