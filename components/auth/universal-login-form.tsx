"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, CheckCircle, Mail, Lock, LogIn, UserPlus } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function UniversalLoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMsg("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/universal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || email.split("@")[0] || "Anonymous",
          email: email,
          credential: password
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed")
      }

      // Defaulting role to citizen since UniversalLoginForm doesn't have a role selector
      const roleToUse = "citizen"

      document.cookie = `civilio-user=${encodeURIComponent(
        JSON.stringify({ userId: data.userId, name: name || "Citizen", email: email, role: roleToUse })
      )}; path=/; max-age=86400`

      window.location.href = "/citizen-portal"
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-border/50 shadow-xl bg-card/80 backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          {isLogin ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin ? "Enter your credentials to access the portal" : "Sign up to start engaging with your city"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMsg ? (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-6 text-center space-y-3">
            <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">{successMsg}</p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => { setIsLogin(true); setSuccessMsg(""); }}>
              Proceed to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-background"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-10 h-11 bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-10 h-11 bg-background"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 flex gap-3 text-sm text-red-700 dark:text-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isLogin ? (
                  <><LogIn className="mr-2 h-5 w-5" /> Sign In</>
                ) : (
                  <><UserPlus className="mr-2 h-5 w-5" /> Create Account</>
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
