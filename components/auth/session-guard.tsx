"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface SessionGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function SessionGuard({ children, redirectTo = "/auth/login" }: SessionGuardProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifySession = () => {
      try {
        const cookies = document.cookie.split("; ")
        const userCookie = cookies.find(row => row.startsWith("civilio-user="))
        const oldSession = cookies.find(row => row.startsWith("civilio-session="))

        if (userCookie || oldSession) {
          setIsVerified(true)
        } else {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error("Session verification error:", error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    verifySession()
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying your session...</p>
        </div>
      </div>
    )
  }

  if (!isVerified) return null

  return <>{children}</>
}
