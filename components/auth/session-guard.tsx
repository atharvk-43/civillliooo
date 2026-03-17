"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface SessionGuardProps {
  children: React.ReactNode
}

export function SessionGuard({ children }: SessionGuardProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Check if session cookie exists
        const sessionCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("civilio-session="))
          ?.split("=")[1]

        if (!sessionCookie) {
          router.push("/auth/login")
          return
        }

        // Verify session with backend
        const response = await fetch("/api/auth/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionCookie }),
        })

        if (response.ok) {
          setIsVerified(true)
        } else {
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("[v0] Session verification error:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    verifySession()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!isVerified) {
    return null
  }

  return <>{children}</>
}
