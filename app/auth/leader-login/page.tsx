"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"

export default function LeaderLoginPage() {
  const router = useRouter()
  const { login } = useUser()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showLetter, setShowLetter] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: '',
    appointmentLetterNumber: ''
  })

  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    adminPosition: 'mayor',
    appointmentLetterNumber: '',
    appointmentDate: '',
    phoneNumber: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/leader-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        login('chief_minister', data.data.userId)
        localStorage.setItem('sessionToken', data.data.sessionToken)
        localStorage.setItem('userType', 'leader')
        localStorage.setItem('userData', JSON.stringify(data.data))
        
        setTimeout(() => router.push('/admin/dashboard'), 1500)
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

    if (!regForm.fullName || !regForm.email || !regForm.appointmentLetterNumber) {
      setMessage({ type: 'error', text: 'Please fill all required fields' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/leader-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Registration submitted successfully! Administrative verification required (2-3 business days). You will receive a confirmation email.' 
        })
        setRegForm({
          fullName: '',
          email: '',
          adminPosition: 'mayor',
          appointmentLetterNumber: '',
          appointmentDate: '',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Civilio</h1>
          <p className="text-muted-foreground">Administrative Leadership Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Leader Login' : 'Leader Registration'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Access administrative and governance dashboards'
                : 'Register your administrative position and credentials'}
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
                  <label className="text-sm font-medium text-foreground mb-1 block">Official Email</label>
                  <Input
                    type="email"
                    placeholder="official.email@government.in"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Appointment Letter Number</label>
                  <div className="relative">
                    <Input
                      type={showLetter ? "text" : "password"}
                      placeholder="Enter your appointment letter number"
                      value={loginForm.appointmentLetterNumber}
                      onChange={(e) => setLoginForm({ ...loginForm, appointmentLetterNumber: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLetter(!showLetter)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showLetter ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Reference number from your official appointment letter</p>
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
                    className="text-purple-600 hover:underline"
                  >
                    Register your administrative credentials
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
                  <label className="text-sm font-medium text-foreground mb-1 block">Official Email</label>
                  <Input
                    type="email"
                    placeholder="official.email@government.in"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Administrative Position</label>
                  <Select value={regForm.adminPosition} onValueChange={(val) => setRegForm({ ...regForm, adminPosition: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chief_minister">Chief Minister</SelectItem>
                      <SelectItem value="district_magistrate">District Magistrate</SelectItem>
                      <SelectItem value="deputy_district_magistrate">Deputy District Magistrate</SelectItem>
                      <SelectItem value="mayor">Mayor</SelectItem>
                      <SelectItem value="municipal_commissioner">Municipal Commissioner</SelectItem>
                      <SelectItem value="department_head">Department Head</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Appointment Letter Number</label>
                  <Input
                    type="password"
                    placeholder="Your appointment letter reference number"
                    value={regForm.appointmentLetterNumber}
                    onChange={(e) => setRegForm({ ...regForm, appointmentLetterNumber: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Appointment Date</label>
                  <Input
                    type="date"
                    value={regForm.appointmentDate}
                    onChange={(e) => setRegForm({ ...regForm, appointmentDate: e.target.value })}
                    required
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

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded p-3 text-xs text-blue-900 dark:text-blue-100">
                  Your appointment details will be verified with government records. This may take 2-3 business days.
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
                    className="text-purple-600 hover:underline"
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
            <Link href="/auth/citizen-login" className="text-purple-600 hover:underline">
              Citizen Login
            </Link>
            <span>•</span>
            <Link href="/auth/worker-login" className="text-purple-600 hover:underline">
              Worker/Vendor Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
