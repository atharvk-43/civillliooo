'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Shield, Wrench, ChevronRight } from 'lucide-react'

export default function AuthPortal() {
  const [selectedType, setSelectedType] = useState<'citizen' | 'leader' | 'worker' | null>(null)

  const authTypes = [
    {
      id: 'citizen',
      title: 'Citizen',
      description: 'Report issues and participate in civic governance',
      icon: Users,
      color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
      requirements: ['Aadhar, PAN, or Voter ID', 'Email address', 'Phone number (optional)'],
    },
    {
      id: 'leader',
      title: 'Administrative Leader',
      description: 'Chief Minister, District Magistrate, Mayor, etc.',
      icon: Shield,
      color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900',
      requirements: ['Position and jurisdiction', 'Appointment letter number', 'Official email'],
    },
    {
      id: 'worker',
      title: 'Worker / Vendor',
      description: 'Municipal staff, contractors, and vendors',
      icon: Wrench,
      color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900',
      requirements: ['Appointment ID', 'Permission document (PDF)', 'Supervisor details'],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Civilio Platform</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure authentication for citizens, leaders, and municipal workers
          </p>
        </div>

        {/* Auth Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {authTypes.map(type => {
            const Icon = type.icon
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedType === type.id ? 'ring-2 ring-primary' : ''
                } ${type.color} border`}
                onClick={() => setSelectedType(type.id as any)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    {selectedType === type.id && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Requirements:</p>
                    <ul className="space-y-1">
                      {type.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Selected Type Info and Action */}
        {selectedType && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>
                  {authTypes.find(t => t.id === selectedType)?.title} Authentication
                </CardTitle>
                <CardDescription>
                  Complete the verification process to access the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100 space-y-2">
                  <p className="font-semibold">Verification Process:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    {selectedType === 'citizen' && (
                      <>
                        <li>Enter your identification details</li>
                        <li>Your ID will be verified against government databases</li>
                        <li>Approval typically within 24-48 hours</li>
                        <li>Receive email confirmation</li>
                      </>
                    )}
                    {selectedType === 'leader' && (
                      <>
                        <li>Submit appointment credentials</li>
                        <li>Admin will verify official records</li>
                        <li>2-3 business days processing</li>
                        <li>Dashboard access upon approval</li>
                      </>
                    )}
                    {selectedType === 'worker' && (
                      <>
                        <li>Upload permission document</li>
                        <li>Document review by admin</li>
                        <li>1-2 business days verification</li>
                        <li>Access to worker portal granted</li>
                      </>
                    )}
                  </ol>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      const paths = {
                        citizen: '/auth/citizen',
                        leader: '/auth/leader',
                        worker: '/auth/worker',
                      }
                      window.location.href = paths[selectedType]
                    }}
                    className="w-full"
                    size="lg"
                  >
                    Continue to {authTypes.find(t => t.id === selectedType)?.title} Login
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setSelectedType(null)}
                    variant="outline"
                    className="w-full"
                  >
                    Choose Different Portal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">🔐</div>
            <h3 className="font-semibold text-foreground">Data Security</h3>
            <p className="text-sm text-muted-foreground">
              All data encrypted and stored securely with government-grade encryption
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">✓</div>
            <h3 className="font-semibold text-foreground">Verified Access</h3>
            <p className="text-sm text-muted-foreground">
              Identity verified against official government databases
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">📊</div>
            <h3 className="font-semibold text-foreground">Audit Trail</h3>
            <p className="text-sm text-muted-foreground">
              All login attempts logged for transparency and security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
