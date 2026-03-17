'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Loader, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

const WORKER_TYPES = [
  { value: 'vendor', label: 'Vendor' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'department_staff', label: 'Department Staff' },
  { value: 'field_worker', label: 'Field Worker' },
]

interface WorkerLoginFormProps {
  onSuccess?: (data: any) => void
}

export function WorkerLoginForm({ onSuccess }: WorkerLoginFormProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    workerType: 'vendor',
    appointmentId: '',
    municipality: '',
    department: '',
    designation: '',
    supervisorName: '',
    supervisorEmail: '',
    phoneNumber: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB')
        return
      }
      setDocumentFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!isLogin && !documentFile) {
        setError('Please upload the permission document')
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          ...formData,
          documentPath: documentFile?.name || '',
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
          setTimeout(() => router.push('/worker/dashboard'), 2000)
        } else {
          setError(data.message)
        }
      } else {
        setSuccess('Registration submitted. Document verification required (1-2 business days).')
        setFormData({
          fullName: '',
          email: '',
          workerType: 'vendor',
          appointmentId: '',
          municipality: '',
          department: '',
          designation: '',
          supervisorName: '',
          supervisorEmail: '',
          phoneNumber: '',
        })
        setDocumentFile(null)
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
          {isLogin ? 'Worker/Vendor Login' : 'Worker/Vendor Registration'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Login with your appointment credentials'
            : 'Register as a municipal worker or vendor'}
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
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@municipality.in"
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
            <Label htmlFor="appointmentId">Appointment ID *</Label>
            <Input
              id="appointmentId"
              name="appointmentId"
              placeholder="e.g., MUN-2024-001234"
              value={formData.appointmentId}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Unique identifier from your appointment document
            </p>
          </div>

          <div>
            <Label htmlFor="workerType">Worker Type *</Label>
            <select
              id="workerType"
              name="workerType"
              value={formData.workerType}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              {WORKER_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {!isLogin && (
            <>
              <div>
                <Label htmlFor="municipality">Municipality *</Label>
                <Input
                  id="municipality"
                  name="municipality"
                  placeholder="Municipality name"
                  value={formData.municipality}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Department or section"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  name="designation"
                  placeholder="Your designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="supervisorName">Supervisor Name</Label>
                <Input
                  id="supervisorName"
                  name="supervisorName"
                  placeholder="Immediate supervisor"
                  value={formData.supervisorName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="supervisorEmail">Supervisor Email</Label>
                <Input
                  id="supervisorEmail"
                  name="supervisorEmail"
                  type="email"
                  placeholder="supervisor@municipality.in"
                  value={formData.supervisorEmail}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Contact Number</Label>
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
                <Label htmlFor="document">Permission Document (PDF/Image) *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <label
                    htmlFor="document"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {documentFile ? documentFile.name : 'Click to upload or drag & drop'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, JPG, or PNG (max 5MB)
                    </span>
                  </label>
                </div>
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
          <p className="font-semibold">Document Requirements:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Official appointment letter or contract</li>
            <li>Clear scanned copy or photograph</li>
            <li>Include all official stamps and signatures</li>
            <li>Verification within 1-2 business days</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
