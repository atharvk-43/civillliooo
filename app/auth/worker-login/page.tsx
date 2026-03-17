"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Eye, EyeOff, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"

export default function WorkerLoginPage() {
  const router = useRouter()
  const { login } = useUser()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showId, setShowId] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [loginForm, setLoginForm] = useState({
    email: '',
    appointmentId: ''
  })

  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    workerType: 'field_worker',
    appointmentId: '',
    municipality: '',
    department: '',
    designation: '',
    phoneNumber: '',
    supervisorName: '',
    supervisorEmail: '',
    appointmentDocument: null as File | null
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/worker-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        login('worker', data.data.userId)
        localStorage.setItem('sessionToken', data.data.sessionToken)
        localStorage.setItem('userType', 'worker')
        localStorage.setItem('userData', JSON.stringify(data.data))
        
        setTimeout(() => router.push('/worker/dashboard'), 1500)
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

    if (!regForm.fullName || !regForm.email || !regForm.appointmentId || !regForm.appointmentDocument) {
      setMessage({ type: 'error', text: 'Please fill all required fields and upload appointment document' })
      setLoading(false)
      return
    }

    try {
      // Upload document first
      const formData = new FormData()
      formData.append('file', regForm.appointmentDocument)
      formData.append('appointmentId', regForm.appointmentId)

      const uploadResponse = await fetch('/api/auth/upload-document', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Document upload failed')
      }

      const uploadData = await uploadResponse.json()

      // Then register
      const response = await fetch('/api/auth/worker-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regForm.fullName,
          email: regForm.email,
          workerType: regForm.workerType,
          appointmentId: regForm.appointmentId,
          municipality: regForm.municipality,
          department: regForm.department,
          designation: regForm.designation,
          phoneNumber: regForm.phoneNumber,
          supervisorName: regForm.supervisorName,
          supervisorEmail: regForm.supervisorEmail,
          appointmentDocumentPath: uploadData.filePath
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Registration submitted! Document verification required (1-2 business days). Confirmation email sent.' 
        })
        setRegForm({
          fullName: '',
          email: '',
          workerType: 'field_worker',
          appointmentId: '',
          municipality: '',
          department: '',
          designation: '',
          phoneNumber: '',
          supervisorName: '',
          supervisorEmail: '',
          appointmentDocument: null
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Civilio</h1>
          <p className="text-muted-foreground">Worker & Vendor Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Worker/Vendor Login' : 'Worker/Vendor Registration'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Access assignment and work tracking tools'
                : 'Register with your appointment credentials and documents'}
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
                  <label className="text-sm font-medium text-foreground mb-1 block">Appointment ID</label>
                  <div className="relative">
                    <Input
                      type={showId ? "text" : "password"}
                      placeholder="Your appointment ID from municipality"
                      value={loginForm.appointmentId}
                      onChange={(e) => setLoginForm({ ...loginForm, appointmentId: e.target.value })}
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
                    className="text-green-600 hover:underline"
                  >
                    Register your appointment
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
                  <label className="text-sm font-medium text-foreground mb-1 block">Worker Type</label>
                  <Select value={regForm.workerType} onValueChange={(val) => setRegForm({ ...regForm, workerType: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="field_worker">Field Worker</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="department_staff">Department Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Appointment ID</label>
                  <Input
                    type="password"
                    placeholder="Your unique appointment ID"
                    value={regForm.appointmentId}
                    onChange={(e) => setRegForm({ ...regForm, appointmentId: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Municipality</label>
                  <Input
                    type="text"
                    placeholder="Municipality name"
                    value={regForm.municipality}
                    onChange={(e) => setRegForm({ ...regForm, municipality: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Department</label>
                  <Input
                    type="text"
                    placeholder="Department name"
                    value={regForm.department}
                    onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Designation</label>
                  <Input
                    type="text"
                    placeholder="Your job title"
                    value={regForm.designation}
                    onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Appointment Document (PDF/JPG)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setRegForm({ ...regForm, appointmentDocument: e.target.files?.[0] || null })}
                      className="hidden"
                      id="doc-upload"
                      required
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center gap-1">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{regForm.appointmentDocument?.name || 'Click to upload document'}</span>
                      <span className="text-xs text-muted-foreground">PDF or Image (Max 5MB)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="Your contact number"
                    value={regForm.phoneNumber}
                    onChange={(e) => setRegForm({ ...regForm, phoneNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Supervisor Name (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Your supervisor's name"
                    value={regForm.supervisorName}
                    onChange={(e) => setRegForm({ ...regForm, supervisorName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Supervisor Email (Optional)</label>
                  <Input
                    type="email"
                    placeholder="Supervisor's email"
                    value={regForm.supervisorEmail}
                    onChange={(e) => setRegForm({ ...regForm, supervisorEmail: e.target.value })}
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
                    className="text-green-600 hover:underline"
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
            <Link href="/auth/citizen-login" className="text-green-600 hover:underline">
              Citizen Login
            </Link>
            <span>•</span>
            <Link href="/auth/leader-login" className="text-green-600 hover:underline">
              Leader Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
