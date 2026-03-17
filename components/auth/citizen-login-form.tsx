'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CitizenLoginFormProps {
  onSuccess?: (data: any) => void
}

export function CitizenLoginForm({ onSuccess }: CitizenLoginFormProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    identificationType: 'aadhar' as 'aadhar' | 'pan' | 'epic',
    identificationNumber: '',
    locality: '',
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
      const response = await fetch('/api/auth/citizen', {
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
          setVerificationStatus('verified')
          if (onSuccess) {
            onSuccess(data.data)
          }
          setTimeout(() => router.push('/citizen-portal'), 2000)
        } else {
          setVerificationStatus('pending')
          setError(data.message)
        }
      } else {
        setSuccess('Registration submitted! Your identity will be verified within 24-48 hours.')
        setVerificationStatus('pending')
        setFormData({
          fullName: '',
          email: '',
          identificationType: 'aadhar',
          identificationNumber: '',
          locality: '',
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
          {isLogin ? 'Citizen Login' : 'Citizen Registration'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Login with your verified identification'
            : 'Register to participate in civic governance'}
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

        {verificationStatus === 'pending' && (
          <div className="flex gap-2 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3 text-sm text-yellow-700 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>Your account is pending verification. You will be notified via email when verified.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
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
            <Label htmlFor="identificationType">Identification Type *</Label>
            <select
              id="identificationType"
              name="identificationType"
              value={formData.identificationType}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="aadhar">Aadhar</option>
              <option value="pan">PAN (Tax ID)</option>
              <option value="epic">EPIC (Voter ID)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="identificationNumber">
              {formData.identificationType === 'aadhar' && 'Aadhar Number (12 digits)'}
              {formData.identificationType === 'pan' && 'PAN (10 alphanumeric)'}
              {formData.identificationType === 'epic' && 'Voter ID (EPIC)'} *
            </Label>
            <Input
              id="identificationNumber"
              name="identificationNumber"
              placeholder={
                formData.identificationType === 'aadhar'
                  ? '1234 5678 9012'
                  : formData.identificationType === 'pan'
                    ? 'ABCDE1234F'
                    : 'ABC1234567D'
              }
              value={formData.identificationNumber}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your identification will be verified against government databases.
            </p>
          </div>

          {!isLogin && (
            <>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
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

              <div>
                <Label htmlFor="locality">Locality/Ward</Label>
                <Input
                  id="locality"
                  name="locality"
                  placeholder="Your locality or ward name"
                  value={formData.locality}
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
              setVerificationStatus(null)
            }}
            className="font-semibold text-primary hover:underline"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p className="font-semibold">Security Information:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Your identification number is encrypted</li>
            <li>Verification typically takes 24-48 hours</li>
            <li>Keep your session token secure</li>
            <li>You will receive email notifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
