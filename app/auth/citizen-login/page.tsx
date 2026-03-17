"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"

export default function CitizenLoginPage() {
  const router = useRouter()
  const { login } = useUser()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showId, setShowId] = useState(false)

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    identificationNumber: ''
  })

  // Registration form state
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    identificationType: 'aadhar',
    identificationNumber: '',
    locality: '',
    phoneNumber: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/citizen-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          identificationNumber: loginForm.identificationNumber
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        // Store session and user data
        login('citizen', data.data.userId)
        localStorage.setItem('sessionToken', data.data.sessionToken)
        localStorage.setItem('userType', 'citizen')
        localStorage.setItem('userData', JSON.stringify(data.data))
        
        setTimeout(() => router.push('/citizen-portal'), 1500)
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
      console.error('[v0] Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!regForm.fullName || !regForm.email || !regForm.identificationNumber) {
      setMessage({ type: 'error', text: 'Please fill all required fields' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/citizen-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regForm.fullName,
          email: regForm.email,
          identificationType: regForm.identificationType,
          identificationNumber: regForm.identificationNumber,
          locality: regForm.locality,
          phoneNumber: regForm.phoneNumber
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Registration successful! Your identity will be verified within 24 hours. You will receive a confirmation email.' 
        })
        setRegForm({
          fullName: '',
          email: '',
          identificationType: 'aadhar',
          identificationNumber: '',
          locality: '',
          phoneNumber: ''
        })
        setTimeout(() => setIsLogin(true), 3000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
      console.error('[v0] Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Civilio</h1>
          <p className="text-muted-foreground">Citizen Portal Authentication</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Citizen Login' : 'Citizen Registration'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Access your grievance tracking and civic participation'
                : 'Register to report issues and contribute to your community'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert className={message.type === 'success' ? 'mb-4 bg-green-50 border-green-200' : 'mb-4 bg-red-50 border-red-200'}>
                <AlertCircle className={`h-4 w-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                <AlertDescription className={message.type === 'success' ? 'text-green-900' : 'text-red-900'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Identification Number (Aadhar/PAN/EPIC)
                  </label>
                  <div className="relative">
                    <Input
                      type={showId ? "text" : "password"}
                      placeholder="Enter your ID number"
                      value={loginForm.identificationNumber}
                      onChange={(e) => setLoginForm({ ...loginForm, identificationNumber: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowId(!showId)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Your ID is encrypted and never stored in plain text</p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false)
                      setMessage(null)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Don't have an account? Register here
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Your full name"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Identification Type</label>
                  <Select value={regForm.identificationType} onValueChange={(val) => setRegForm({ ...regForm, identificationType: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhar Number</SelectItem>
                      <SelectItem value="pan">PAN (Tax ID)</SelectItem>
                      <SelectItem value="epic">Voter ID (EPIC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Identification Number</label>
                  <Input
                    type="password"
                    placeholder="Your identification number"
                    value={regForm.identificationNumber}
                    onChange={(e) => setRegForm({ ...regForm, identificationNumber: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Locality (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Your locality or ward name"
                    value={regForm.locality}
                    onChange={(e) => setRegForm({ ...regForm, locality: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone Number (Optional)</label>
                  <Input
                    type="tel"
                    placeholder="Your contact number"
                    value={regForm.phoneNumber}
                    onChange={(e) => setRegForm({ ...regForm, phoneNumber: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {loading ? 'Registering...' : 'Register'}
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true)
                      setMessage(null)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Already registered? Login here
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Other login options:</p>
          <div className="flex gap-2 justify-center">
            <Link href="/auth/leader-login" className="text-blue-600 hover:underline">
              Leader Login
            </Link>
            <span>•</span>
            <Link href="/auth/worker-login" className="text-blue-600 hover:underline">
              Worker/Vendor Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
