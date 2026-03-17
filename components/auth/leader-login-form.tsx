'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

const POSITIONS = [
  { value: 'chief_minister', label: 'Chief Minister (CM)' },
  { value: 'district_magistrate', label: 'District Magistrate (DM)' },
  { value: 'deputy_district_magistrate', label: 'Deputy District Magistrate (DDM)' },
  { value: 'mayor', label: 'Mayor' },
  { value: 'municipal_commissioner', label: 'Municipal Commissioner' },
  { value: 'department_head', label: 'Department Head' },
]

interface LeaderLoginFormProps {
  onSuccess?: (data: any) => void
}

export function LeaderLoginForm({ onSuccess }: LeaderLoginFormProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: 'chief_minister',
    appointmentLetterNumber: '',
    appointmentDate: '',
    jurisdictionId: '',
    phoneNumber: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/leader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Authentication failed')
        return
      }

      if (isLogin) {
        if (data.success) {
          setSuccess('Login successful! Redirecting...')
          if (onSuccess) {
            onSuccess(data.data)
          }
          setTimeout(() => router.push('/admin/dashboard'), 2000)
        } else {
          setError(data.message)
        }
      } else {
        setSuccess('Registration submitted. Administrative verification required (2-3 business days).')
        setFormData({
          fullName: '',
          email: '',
          position: 'chief_minister',
          appointmentLetterNumber: '',
          appointmentDate: '',
          jurisdictionId: '',
          phoneNumber: '',
        })
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('[v0]', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isLogin ? 'Administrative Leader Login' : 'Administrative Leader Registration'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Login with your appointment credentials'
            : 'Register your administrative position'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm text-red-700 dark:text-red-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3 text-sm text-green-700 dark:text-green-200">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Official Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="official@government.in"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Your Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="position">Position *</Label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              {POSITIONS.map(pos => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="appointmentLetterNumber">Appointment Letter Number *</Label>
            <Input
              id="appointmentLetterNumber"
              name="appointmentLetterNumber"
              placeholder="e.g., GOV-2024-12345"
              value={formData.appointmentLetterNumber}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Reference number from your official appointment letter
            </p>
          </div>

          {!isLogin && (
            <>
              <div>
                <Label htmlFor="appointmentDate">Appointment Date *</Label>
                <Input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="jurisdictionId">Jurisdiction/District *</Label>
                <Input
                  id="jurisdictionId"
                  name="jurisdictionId"
                  placeholder="District or jurisdiction name"
                  value={formData.jurisdictionId}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Official Contact Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : 'Already registered? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setSuccess('')
            }}
            className="font-semibold text-primary hover:underline"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p className="font-semibold">Verification Process:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Submit official appointment credentials</li>
            <li>Admin will verify with government records</li>
            <li>2-3 business days processing time</li>
            <li>Email confirmation upon approval</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
