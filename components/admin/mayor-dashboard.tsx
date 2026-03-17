'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState } from 'react'
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  MessageSquare,
  Navigation,
  Pause,
  Play,
  RouteIcon,
  Zap,
  TrendingUp,
} from 'lucide-react'

interface Ward {
  id: number
  name: string
  councilMemberId: number
  councilMemberName: string
  population: number
  totalIssues: number
  resolvedIssues: number
  area: string
}

interface IssueCategory {
  id: number
  name: string
  icon: string
  issueCount: number
  avgResolutionDays: number
  status: 'active' | 'backlog'
}

interface IssueRouting {
  id: number
  title: string
  category: string
  source: string
  sourceWard: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'routed' | 'reassigned' | 'unresolvable'
  assignedTo?: string
  routedDate?: string
  reason?: string
}

interface MunicipalCommissioner {
  id: number
  name: string
  department: string
  wardAssignments: number
  performanceScore: number
}

interface MayorMetrics {
  totalIssues: number
  resolvedIssues: number
  pendingIssues: number
  avgResolutionDays: number
  wardCount: number
  citizenSatisfaction: number
  routingAccuracy: number
}

export function MayorDashboard() {
  const [showRoutingDialog, setShowRoutingDialog] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<IssueRouting | null>(null)
  const [routingForm, setRoutingForm] = useState({
    ward: '',
    department: '',
    reason: '',
  })

  const metrics: MayorMetrics = {
    totalIssues: 1850,
    resolvedIssues: 1540,
    pendingIssues: 310,
    avgResolutionDays: 3.8,
    wardCount: 8,
    citizenSatisfaction: 82,
    routingAccuracy: 94,
  }

  const wards: Ward[] = [
    {
      id: 1,
      name: 'Ward 1 - Old City',
      councilMemberId: 301,
      councilMemberName: 'Ajay Kumar',
      population: 25400,
      totalIssues: 342,
      resolvedIssues: 298,
      area: 'Central city area',
    },
    {
      id: 2,
      name: 'Ward 2 - Residential',
      councilMemberId: 302,
      councilMemberName: 'Kavya Singh',
      population: 18900,
      totalIssues: 267,
      resolvedIssues: 241,
      area: 'Residential zone',
    },
    {
      id: 3,
      name: 'Ward 3 - Industrial',
      councilMemberId: 303,
      councilMemberName: 'Vikram Chopra',
      population: 12300,
      totalIssues: 189,
      resolvedIssues: 152,
      area: 'Industrial area',
    },
  ]

  const issueCategories: IssueCategory[] = [
    {
      id: 1,
      name: 'Roads & Potholes',
      icon: '🛣️',
      issueCount: 456,
      avgResolutionDays: 3.2,
      status: 'active',
    },
    {
      id: 2,
      name: 'Water & Sewage',
      icon: '💧',
      issueCount: 234,
      avgResolutionDays: 2.8,
      status: 'active',
    },
    {
      id: 3,
      name: 'Waste Management',
      icon: '♻️',
      issueCount: 189,
      avgResolutionDays: 1.9,
      status: 'active',
    },
    {
      id: 4,
      name: 'Street Lights',
      icon: '💡',
      issueCount: 145,
      avgResolutionDays: 4.1,
      status: 'backlog',
    },
    {
      id: 5,
      name: 'Parks & Green Space',
      icon: '🌳',
      issueCount: 98,
      avgResolutionDays: 5.3,
      status: 'backlog',
    },
    {
      id: 6,
      name: 'Garbage & Sanitation',
      icon: '🗑️',
      issueCount: 234,
      avgResolutionDays: 2.1,
      status: 'active',
    },
  ]

  const pendingIssues: IssueRouting[] = [
    {
      id: 1,
      title: 'Pothole on Main Road',
      category: 'Roads & Potholes',
      source: 'Citizens App',
      sourceWard: 'Ward 1 - Old City',
      severity: 'high',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Water Leakage on Pine Street',
      category: 'Water & Sewage',
      source: 'WhatsApp Complaint',
      sourceWard: 'Ward 2 - Residential',
      severity: 'medium',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Broken Streetlight Zone A',
      category: 'Street Lights',
      source: 'Citizen Portal',
      sourceWard: 'Ward 3 - Industrial',
      severity: 'low',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Garbage Spillage - Market Area',
      category: 'Garbage & Sanitation',
      source: 'Direct Call',
      sourceWard: 'Ward 1 - Old City',
      severity: 'critical',
      status: 'pending',
    },
  ]

  const commissioners: MunicipalCommissioner[] = [
    {
      id: 1,
      name: 'Dr. Rajesh Desai',
      department: 'Engineering & Roads',
      wardAssignments: 4,
      performanceScore: 92,
    },
    {
      id: 2,
      name: 'Priya Nair',
      department: 'Water & Waste Management',
      wardAssignments: 4,
      performanceScore: 88,
    },
    {
      id: 3,
      name: 'Amit Verma',
      department: 'Parks & Green Spaces',
      wardAssignments: 3,
      performanceScore: 85,
    },
  ]

  const handleRouting = async () => {
    if (selectedIssue) {
      console.log('Routing issue:', {
        issueId: selectedIssue.id,
        ...routingForm,
      })
      setShowRoutingDialog(false)
      setRoutingForm({ ward: '', department: '', reason: '' })
      setSelectedIssue(null)
    }
  }

  const getSeverityColor = (severity: IssueRouting['severity']) => {
    const colors: Record<IssueRouting['severity'], string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    }
    return colors[severity]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold text-foreground mb-3">Mayor City Management Center</h1>
        <p className="text-lg text-muted-foreground">
          Route citizen issues to wards and departments. Monitor municipal services and ensure timely resolution.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Building className="h-4 w-4" />
            Total Issues
          </p>
          <p className="text-3xl font-bold text-blue-600">{metrics.totalIssues.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{metrics.resolvedIssues} resolved</p>
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Pending Issues
          </p>
          <p className="text-3xl font-bold text-orange-600">{metrics.pendingIssues}</p>
          <p className="text-xs text-muted-foreground">Awaiting routing</p>
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Avg Resolution
          </p>
          <p className="text-3xl font-bold text-green-600">{metrics.avgResolutionDays}</p>
          <p className="text-xs text-muted-foreground">Days</p>
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Wards
          </p>
          <p className="text-3xl font-bold text-purple-600">{metrics.wardCount}</p>
          <p className="text-xs text-muted-foreground">Under administration</p>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Citizen Satisfaction
          </p>
          <p className="text-3xl font-bold text-cyan-600">{metrics.citizenSatisfaction}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${metrics.citizenSatisfaction}%` }} />
          </div>
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <RouteIcon className="h-4 w-4" />
            Routing Accuracy
          </p>
          <p className="text-3xl font-bold text-indigo-600">{metrics.routingAccuracy}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${metrics.routingAccuracy}%` }} />
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="routing" className="space-y-6">
        <TabsList className="bg-card border border-border grid-cols-4">
          <TabsTrigger value="routing" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span>Routing</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="wards" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Wards</span>
          </TabsTrigger>
          <TabsTrigger value="commissioners" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Commissioners</span>
          </TabsTrigger>
        </TabsList>

        {/* Issue Routing Tab */}
        <TabsContent value="routing" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Issue Routing Queue</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-3">
            {pendingIssues.map((issue) => (
              <Card key={issue.id} className="p-5 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-2xl">
                        {issueCategories.find((c) => c.name === issue.category)?.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{issue.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {issue.category} • {issue.sourceWard}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Source: {issue.source}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                  </Badge>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Full Details
                  </Button>
                  <Dialog open={showRoutingDialog && selectedIssue?.id === issue.id} onOpenChange={setShowRoutingDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Route Issue
                      </Button>
                    </DialogTrigger>
                    {selectedIssue?.id === issue.id && (
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Route Issue to Department</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-muted p-3 rounded border border-border">
                            <p className="text-xs text-muted-foreground">Issue:</p>
                            <p className="font-semibold text-foreground">{selectedIssue.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">Category: {selectedIssue.category}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Select Ward</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                              <option>Select ward...</option>
                              {wards.map((w) => (
                                <option key={w.id} value={w.id}>
                                  {w.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Department</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                              <option>Select department...</option>
                              <option>Engineering & Roads</option>
                              <option>Water & Waste Management</option>
                              <option>Parks & Green Spaces</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Routing Reason</label>
                            <textarea
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                              placeholder="Why is this routed to this department?"
                              rows={3}
                              value={routingForm.reason}
                              onChange={(e) =>
                                setRoutingForm({
                                  ...routingForm,
                                  reason: e.target.value,
                                })
                              }
                            />
                          </div>
                          <Button onClick={handleRouting} className="w-full bg-blue-600 hover:bg-blue-700">
                            Confirm Routing
                          </Button>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Issue Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Issue Categories Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issueCategories.map((category) => (
              <Card key={category.id} className="p-5 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                  </h3>
                  <Badge
                    className={
                      category.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }
                  >
                    {category.status === 'active' ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                    {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="bg-muted rounded p-2 text-center">
                    <p className="text-2xl font-bold text-blue-600">{category.issueCount}</p>
                    <p className="text-xs text-muted-foreground">Total Issues</p>
                  </div>
                  <div className="bg-muted rounded p-2 text-center">
                    <p className="text-lg font-semibold text-purple-600">{category.avgResolutionDays}</p>
                    <p className="text-xs text-muted-foreground">Avg Days to Resolve</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Category Details
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Wards Tab */}
        <TabsContent value="wards" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ward Management</h2>
          <div className="space-y-4">
            {wards.map((ward) => (
              <Card key={ward.id} className="p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {ward.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Council Member: {ward.councilMemberName} • Population: {ward.population.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{ward.area}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Total Issues</p>
                    <p className="text-2xl font-bold text-foreground">{ward.totalIssues}</p>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{ward.resolvedIssues}</p>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Completion %</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round((ward.resolvedIssues / ward.totalIssues) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Ward Issues
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Performance Report
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Commissioners Tab */}
        <TabsContent value="commissioners" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Municipal Commissioners</h2>
          <div className="space-y-4">
            {commissioners.map((commissioner) => (
              <Card key={commissioner.id} className="p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{commissioner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-foreground">{commissioner.name}</h3>
                      <p className="text-sm text-muted-foreground">{commissioner.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-600">{commissioner.performanceScore}%</p>
                    <p className="text-xs text-muted-foreground">Performance Score</p>
                  </div>
                </div>

                <div className="bg-muted rounded p-3 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Ward Assignments: <strong>{commissioner.wardAssignments}</strong>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Review Performance
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Assign Issues
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Governance Notes */}
      <Card className="p-6 border-2 border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/20">
        <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-3 flex items-center gap-2">
          <Building className="h-5 w-5" />
          Municipal Governance
        </h3>
        <ul className="space-y-2 text-sm text-teal-800 dark:text-teal-200">
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Route citizen issues to appropriate wards and municipal departments</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Monitor city services performance across all wards and categories</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Coordinate with municipal commissioners for effective issue resolution</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Escalate critical issues to District Magistrate when necessary</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
