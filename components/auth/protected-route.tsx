'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: 'citizen' | 'leader' | 'worker'
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get session from cookies
        const sessionToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('sessionToken='))
          ?.split('=')[1]

        if (!sessionToken) {
          router.push('/login')
          return
        }

        // Verify session with backend
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Cookie': `sessionToken=${sessionToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUserType(data.userType)
          
          if (requiredUserType && data.userType !== requiredUserType) {
            router.push('/unauthorized')
            return
          }
          
          setIsAuthenticated(true)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredUserType])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
