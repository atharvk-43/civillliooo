'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { Users, Send, AlertCircle, TrendingUp, BarChart3, CheckCircle, Clock, MapPin, Award, Zap } from 'lucide-react'

interface District {
  id: number
  name: string
  magistrateId: number
  magistrateName: string
  issuesCount: number
  resolutionRate: number
  avgResolutionDays: number
}

interface DelegationRecord {
  id: number
  delegatedTo: string
  delegatedToRole: string
  scope: string
  startDate: string
  endDate?: string
  status: 'active' | 'expired' | 'revoked'
}

interface StateMetrics {
  totalGrievances: number
  resolvedGrievances: number
  pendingGrievances: number
  avgResolutionDays: number
  districtCount: number
  citizenSatisfaction: number
}

export function ChiefMinisterDashboard() {
  const [showDelegationDialog, setShowDelegationDialog] = useState(false)
  const [delegationForm, setDelegationForm] = useState({
    delegateTo: '',
    scope: '',
    reason: '',
  })

  const stateMetrics: StateMetrics = {
    totalGrievances: 12450,
    resolvedGrievances: 9320,
    pendingGrievances: 3130,
    avgResolutionDays: 5.2,
    districtCount: 8,
    citizenSatisfaction: 78,
  }

  const districts: District[] = [
    {
      id: 1,
      name: 'Indore',
      magistrateId: 101,
      magistrateName: 'Akshay Kanti Bumb',
      issuesCount: 2340,
      resolutionRate: 82,
      avgResolutionDays: 4.5,
    },
    {
      id: 2,
      name: 'Ujjain',
      magistrateId: 102,
      magistrateName: 'Rajesh Malviya',
      issuesCount: 1890,
      resolutionRate: 75,
      avgResolutionDays: 5.8,
    },
    {
      id: 3,
      name: 'Dewas',
      magistrateId: 103,
      magistrateName: 'Priya Sharma',
      issuesCount: 1560,
      resolutionRate: 79,
      avgResolutionDays: 5.2,
    },
  ]

  const activeDelegations: DelegationRecord[] = [
    {
      id: 1,
      delegatedTo: 'Rajesh Malviya',
      delegatedToRole: 'District Magistrate, Ujjain',
      scope: 'Water Supply Management & Emergency Response',
      startDate: '2024-01-15',
      status: 'active',
    },
    {
      id: 2,
      delegatedTo: 'Priya Sharma',
      delegatedToRole: 'District Magistrate, Dewas',
      scope: 'Infrastructure Development & Budget Approval',
      startDate: '2024-02-01',
      status: 'active',
    },
  ]

  const handleDelegationSubmit = async () => {
    console.log('Delegation submitted:', delegationForm)
    setShowDelegationDialog(false)
    setDelegationForm({ delegateTo: '', scope: '', reason: '' })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold text-foreground mb-3">Chief Minister Executive Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          State-level governance control center. Monitor all districts, delegate authority, and oversee state-wide public value.
        </p>
      </div>

      {/* State Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Total Grievances (State-wide)</p>
          <p className="text-4xl font-bold text-blue-600">{stateMetrics.totalGrievances.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Across {stateMetrics.districtCount} districts</p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Resolution Rate</p>
          <p className="text-4xl font-bold text-green-600">{stateMetrics.resolvedGrievances.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round((stateMetrics.resolvedGrievances / stateMetrics.totalGrievances) * 100)}% of total grievances
          </p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
          <p className="text-4xl font-bold text-purple-600">{stateMetrics.avgResolutionDays}</p>
          <p className="text-xs text-muted-foreground">Days (Target: 7 days)</p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Pending Issues</p>
          <p className="text-4xl font-bold text-orange-600">{stateMetrics.pendingGrievances.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Requiring attention</p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Districts</p>
          <p className="text-4xl font-bold text-indigo-600">{stateMetrics.districtCount}</p>
          <p className="text-xs text-muted-foreground">Under your authority</p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Citizen Satisfaction</p>
          <p className="text-4xl font-bold text-cyan-600">{stateMetrics.citizenSatisfaction}%</p>
          <p className="text-xs text-muted-foreground">Overall rating</p>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="districts" className="space-y-6">
        <TabsList className="bg-card border border-border grid-cols-3">
          <TabsTrigger value="districts" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Districts</span>
          </TabsTrigger>
          <TabsTrigger value="delegations" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>Delegations</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Districts Tab */}
        <TabsContent value="districts" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">District Performance</h2>
            <Dialog open={showDelegationDialog} onOpenChange={setShowDelegationDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Delegate Authority
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Delegate Executive Authority</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Delegate To (District Magistrate)</label>
                    <input
                      type="text"
                      placeholder="Select DM name"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      value={delegationForm.delegateTo}
                      onChange={(e) =>
                        setDelegationForm({ ...delegationForm, delegateTo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Scope of Delegation</label>
                    <Textarea
                      placeholder="Define specific authority and responsibilities..."
                      className="bg-background"
                      value={delegationForm.scope}
                      onChange={(e) =>
                        setDelegationForm({ ...delegationForm, scope: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reason</label>
                    <Textarea
                      placeholder="Why are you delegating this authority?"
                      className="bg-background"
                      value={delegationForm.reason}
                      onChange={(e) =>
                        setDelegationForm({ ...delegationForm, reason: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleDelegationSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                    Confirm Delegation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {districts.map((district) => (
              <Card key={district.id} className="p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {district.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      District Magistrate: {district.magistrateName}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Zap className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Issues</p>
                    <p className="text-2xl font-bold text-foreground">{district.issuesCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Resolution Rate</p>
                    <p className="text-2xl font-bold text-green-600">{district.resolutionRate}%</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Avg Days to Resolve</p>
                    <p className="text-2xl font-bold text-purple-600">{district.avgResolutionDays}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Review Escalations
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Delegations Tab */}
        <TabsContent value="delegations" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Active Delegations</h2>
          <div className="space-y-4">
            {activeDelegations.map((delegation) => (
              <Card key={delegation.id} className="p-6 border border-border bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{delegation.delegatedTo.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{delegation.delegatedTo}</p>
                        <p className="text-xs text-muted-foreground">{delegation.delegatedToRole}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Scope:</strong> {delegation.scope}
                    </p>
                  </div>
                  <Badge className={delegation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {delegation.status === 'active' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {delegation.status.charAt(0).toUpperCase() + delegation.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Since: {delegation.startDate}</span>
                  {delegation.endDate && <span>Until: {delegation.endDate}</span>}
                </div>
                {delegation.status === 'active' && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Review Performance
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Revoke Delegation
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6 border border-border">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              State-wide Trends
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Resolution Rate</span>
                  <span className="font-bold text-foreground">
                    {Math.round((stateMetrics.resolvedGrievances / stateMetrics.totalGrievances) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(stateMetrics.resolvedGrievances / stateMetrics.totalGrievances) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Citizen Satisfaction Trend</span>
                  <span className="font-bold text-foreground">{stateMetrics.citizenSatisfaction}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${stateMetrics.citizenSatisfaction}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">Top Performing Districts</h4>
                <div className="space-y-2">
                  {[...districts].sort((a, b) => b.resolutionRate - a.resolutionRate).map((d, i) => (
                    <div key={d.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">{i + 1}</Badge>
                        <span className="text-sm text-foreground font-medium">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">{d.resolutionRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Authority & Accountability Section */}
      <Card className="p-6 border-2 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/20">
        <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Your Constitutional Authority
        </h3>
        <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Delegate executive authority to District Magistrates for specific domains</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Monitor all grievances across the state and escalate critical issues</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Approve budgets, major public works, and policy decisions</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Hold districts accountable through performance metrics and public ratings</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
