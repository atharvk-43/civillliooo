'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState } from 'react'
import { AlertCircle, ArrowUp, Building2, CheckCircle2, Clock, Filter, Hourglass, MapPin, Shield, TrendingDown, Users, Zap } from 'lucide-react'

interface Department {
  id: number
  name: string
  headId: number
  headName: string
  staffCount: number
  issuesAssigned: number
  completedIssues: number
  pendingIssues: number
}

interface Grievance {
  id: number
  title: string
  citizenName: string
  category: string
  status: 'new' | 'assigned' | 'in_progress' | 'escalated' | 'resolved'
  severity: 'low' | 'medium' | 'high' | 'critical'
  assignedDepartment?: string
  createdDate: string
  escalationReason?: string
}

interface EscalationRequest {
  id: number
  grievanceId: number
  grievanceTitle: string
  reason: string
  currentStatus: string
  escalatedTo: string
  escalationDate: string
  resolution?: string
}

interface DelegatedAuthority {
  id: number
  scope: string
  delegatedFrom: string
  startDate: string
  endDate?: string
  status: 'active' | 'expired'
}

interface DMMetrics {
  totalGrievances: number
  resolvedGrievances: number
  pendingGrievances: number
  criticalIssues: number
  departmentCount: number
  avgResolutionDays: number
  escalationRate: number
}

export function DistrictMagistrateDashboard() {
  const [showEscalationDialog, setShowEscalationDialog] = useState(false)
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null)
  const [escalationForm, setEscalationForm] = useState({
    reason: '',
    description: '',
  })

  const metrics: DMMetrics = {
    totalGrievances: 2340,
    resolvedGrievances: 1920,
    pendingGrievances: 420,
    criticalIssues: 12,
    departmentCount: 6,
    avgResolutionDays: 4.5,
    escalationRate: 8.2,
  }

  const grievances: Grievance[] = [
    {
      id: 1,
      title: 'Water Supply Emergency',
      citizenName: 'Vijay Kumar',
      category: 'Water Supply',
      status: 'in_progress',
      severity: 'critical',
      assignedDepartment: 'Water Supply & Sanitation',
      createdDate: '2024-01-15',
      escalationReason: 'Multiple wards affected',
    },
    {
      id: 2,
      title: 'Road Infrastructure Collapse',
      citizenName: 'Priya Sharma',
      category: 'Infrastructure',
      status: 'new',
      severity: 'high',
      createdDate: '2024-01-16',
    },
  ]

  const escalationRequests: EscalationRequest[] = [
    {
      id: 1,
      grievanceId: 1,
      grievanceTitle: 'Critical Water Supply Failure',
      reason: 'Multi-district impact, requires state intervention',
      currentStatus: 'Approved',
      escalatedTo: 'Chief Minister',
      escalationDate: '2024-01-15',
      resolution: 'Allocated emergency funds for repair',
    },
  ]

  const delegatedAuthorities: DelegatedAuthority[] = [
    {
      id: 1,
      scope: 'Emergency Water Supply Management',
      delegatedFrom: 'Chief Minister',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'active',
    },
  ]

  const departments: Department[] = [
    {
      id: 1,
      name: 'Water Supply & Sanitation',
      headId: 201,
      headName: 'Ramesh Kumar',
      staffCount: 45,
      issuesAssigned: 156,
      completedIssues: 142,
      pendingIssues: 14,
    },
    {
      id: 2,
      name: 'Public Health & Education',
      headId: 202,
      headName: 'Dr. Meera Singh',
      staffCount: 38,
      issuesAssigned: 203,
      completedIssues: 189,
      pendingIssues: 14,
    },
    {
      id: 3,
      name: 'Roads & Infrastructure',
      headId: 203,
      headName: 'Vikram Patel',
      staffCount: 52,
      issuesAssigned: 234,
      completedIssues: 198,
      pendingIssues: 36,
    },
  ]

  const grievances: Grievance[] = [
    {
      id: 1,
      title: 'Pothole on Main Street',
      citizenName: 'Rajesh Kumar',
      category: 'Infrastructure',
      status: 'in_progress',
      severity: 'high',
      assignedDepartment: 'Roads & Infrastructure',
      createdDate: '2024-03-05',
    },
    {
      id: 2,
      title: 'Water Supply Interruption',
      citizenName: 'Priya Sharma',
      category: 'Water Supply',
      status: 'escalated',
      severity: 'critical',
      assignedDepartment: 'Water Supply & Sanitation',
      createdDate: '2024-03-04',
      escalationReason: 'Prolonged outage affecting 500+ households',
    },
    {
      id: 3,
      title: 'School Building Maintenance',
      citizenName: 'Anmol Gupta',
      category: 'Education',
      status: 'assigned',
      severity: 'medium',
      assignedDepartment: 'Public Health & Education',
      createdDate: '2024-03-03',
    },
    {
      id: 4,
      title: 'Streetlight Installation Request',
      citizenName: 'Deepak Singh',
      category: 'Infrastructure',
      status: 'new',
      severity: 'low',
      createdDate: '2024-03-08',
    },
  ]

  const escalationRequests: EscalationRequest[] = [
    {
      id: 1,
      grievanceId: 2,
      grievanceTitle: 'Water Supply Interruption',
      reason: 'Department unable to resolve within SLA',
      currentStatus: 'Pending Approval',
      escalatedTo: 'Chief Minister',
      escalationDate: '2024-03-06',
    },
    {
      id: 2,
      grievanceId: 5,
      grievanceTitle: 'Hospital Staff Shortage',
      reason: 'Budget approval needed for recruitment',
      currentStatus: 'Approved',
      escalatedTo: 'Chief Minister',
      escalationDate: '2024-03-02',
      resolution: 'Budget approved, hiring in progress',
    },
  ]

  const delegatedAuthorities: DelegatedAuthority[] = [
    {
      id: 1,
      scope: 'Water Supply Management & Emergency Response',
      delegatedFrom: 'Chief Minister',
      startDate: '2024-01-15',
      status: 'active',
    },
  ]

  const handleEscalation = async () => {
    if (selectedGrievance) {
      console.log('Escalating grievance:', {
        grievanceId: selectedGrievance.id,
        ...escalationForm,
      })
      setShowEscalationDialog(false)
      setEscalationForm({ reason: '', description: '' })
      setSelectedGrievance(null)
    }
  }

  const getStatusColor = (status: Grievance['status']) => {
    const colors: Record<Grievance['status'], string> = {
      new: 'bg-blue-100 text-blue-800',
      assigned: 'bg-cyan-100 text-cyan-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      escalated: 'bg-red-100 text-red-800',
      resolved: 'bg-green-100 text-green-800',
    }
    return colors[status]
  }

  const getSeverityIcon = (severity: Grievance['severity']) => {
    const icons: Record<Grievance['severity'], JSX.Element> = {
      low: <AlertCircle className="h-4 w-4 text-blue-600" />,
      medium: <AlertCircle className="h-4 w-4 text-yellow-600" />,
      high: <AlertCircle className="h-4 w-4 text-orange-600" />,
      critical: <AlertCircle className="h-4 w-4 text-red-600" />,
    }
    return icons[severity]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold text-foreground mb-3">District Magistrate Control Center</h1>
        <p className="text-lg text-muted-foreground">
          Manage district governance, escalate critical issues, and coordinate department authorities.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Total Grievances
          </p>
          <p className="text-3xl font-bold text-blue-600">{metrics.totalGrievances.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{metrics.resolvedGrievances} resolved</p>
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Critical Issues
          </p>
          <p className="text-3xl font-bold text-red-600">{metrics.criticalIssues}</p>
          <p className="text-xs text-muted-foreground">Requiring immediate action</p>
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Departments
          </p>
          <p className="text-3xl font-bold text-purple-600">{metrics.departmentCount}</p>
          <p className="text-xs text-muted-foreground">Under your authority</p>
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Avg Resolution
          </p>
          <p className="text-3xl font-bold text-green-600">{metrics.avgResolutionDays}</p>
          <p className="text-xs text-muted-foreground">Days (Target: 7)</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="grievances" className="space-y-6">
        <TabsList className="bg-card border border-border grid-cols-4">
          <TabsTrigger value="grievances" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Grievances</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Departments</span>
          </TabsTrigger>
          <TabsTrigger value="escalations" className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            <span>Escalations</span>
          </TabsTrigger>
          <TabsTrigger value="delegations" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Authority</span>
          </TabsTrigger>
        </TabsList>

        {/* Grievances Tab */}
        <TabsContent value="grievances" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Active Grievances</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-3">
            {grievances.map((grievance) => (
              <Card key={grievance.id} className="p-5 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="mt-1">{getSeverityIcon(grievance.severity)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{grievance.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Citizen: {grievance.citizenName} • {grievance.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {grievance.createdDate}
                      {grievance.assignedDepartment && (
                        <span className="ml-3">
                          • Assigned to: <strong>{grievance.assignedDepartment}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(grievance.status)}>
                      {grievance.status === 'in_progress' && <Hourglass className="h-3 w-3 mr-1" />}
                      {grievance.status === 'escalated' && <ArrowUp className="h-3 w-3 mr-1" />}
                      {grievance.status === 'resolved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {grievance.status.replace(/_/g, ' ').charAt(0).toUpperCase() +
                        grievance.status.slice(1).replace(/_/g, ' ')}
                    </Badge>
                    {grievance.escalationReason && (
                      <p className="text-xs text-red-600 font-medium">{grievance.escalationReason}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {grievance.status !== 'resolved' && grievance.status !== 'escalated' && (
                    <Dialog open={showEscalationDialog && selectedGrievance?.id === grievance.id} onOpenChange={setShowEscalationDialog}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => setSelectedGrievance(grievance)}
                        >
                          <ArrowUp className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      </DialogTrigger>
                      {selectedGrievance?.id === grievance.id && (
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Escalate Grievance</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-3 rounded border border-border">
                              <p className="text-xs text-muted-foreground">Issue:</p>
                              <p className="font-semibold text-foreground">{selectedGrievance.title}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Escalation Reason</label>
                              <Textarea
                                placeholder="Why are you escalating this issue?"
                                className="bg-background"
                                value={escalationForm.reason}
                                onChange={(e) =>
                                  setEscalationForm({
                                    ...escalationForm,
                                    reason: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Additional Details</label>
                              <Textarea
                                placeholder="Provide context for the escalation..."
                                className="bg-background"
                                value={escalationForm.description}
                                onChange={(e) =>
                                  setEscalationForm({
                                    ...escalationForm,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <Button onClick={handleEscalation} className="w-full bg-red-600 hover:bg-red-700">
                              Confirm Escalation
                            </Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Department Management</h2>
          <div className="space-y-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      {dept.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Head: {dept.headName} • {dept.staffCount} staff members
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Assigned</p>
                    <p className="text-xl font-bold text-foreground">{dept.issuesAssigned}</p>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold text-green-600">{dept.completedIssues}</p>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold text-orange-600">{dept.pendingIssues}</p>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Completion %</p>
                    <p className="text-xl font-bold text-blue-600">
                      {Math.round((dept.completedIssues / dept.issuesAssigned) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Department Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Assign Issues
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Performance Review
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Escalations Tab */}
        <TabsContent value="escalations" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Escalation Management</h2>
          <div className="space-y-4">
            {escalationRequests.map((req) => (
              <Card key={req.id} className={`p-6 border-2 ${req.currentStatus === 'Approved' ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:bg-red-950/20'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{req.grievanceTitle}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Escalated to: {req.escalatedTo}</p>
                  </div>
                  <Badge
                    className={
                      req.currentStatus === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {req.currentStatus === 'Approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {req.currentStatus}
                  </Badge>
                </div>

                <div className="bg-muted/60 rounded p-3 mb-3">
                  <p className="text-sm"><strong>Reason:</strong> {req.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">Date: {req.escalationDate}</p>
                </div>

                {req.resolution && (
                  <div className="bg-green-100 dark:bg-green-900/30 rounded p-3">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Resolution:</strong> {req.resolution}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Delegations Tab */}
        <TabsContent value="delegations" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Delegated Authority from CM</h2>
          {delegatedAuthorities.length > 0 ? (
            <div className="space-y-4">
              {delegatedAuthorities.map((auth) => (
                <Card key={auth.id} className="p-6 border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        {auth.scope}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Delegated by:</strong> {auth.delegatedFrom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Active since:</strong> {auth.startDate}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Zap className="h-3 w-3 mr-1" />
                      {auth.status.charAt(0).toUpperCase() + auth.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    This delegation grants you specific authority to manage the above scope. Use these powers responsibly and with full
                    accountability to your superior.
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-muted/50 border-dashed border-2">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No delegated authority currently active</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Accountability Notice */}
      <Card className="p-6 border-2 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
        <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Accountability & Responsibility
        </h3>
        <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
          <li className="flex gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>All decisions and escalations are logged and auditable</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>You are responsible for departmental performance and grievance resolution</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Regular audits will assess your grievance management and delegation decisions</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
