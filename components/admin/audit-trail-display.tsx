'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import {
  ActivitySquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  EyeOff,
  Filter,
  History,
  Zap,
  Shield,
  TrendingDown,
  Users,
  BarChart3,
} from 'lucide-react'
import type { AuditTrailEntry, AuditStatistics } from '@/lib/audit-trail'
import { calculateAuditStatistics, generateComplianceChecklist, detectSuspiciousActivities } from '@/lib/audit-trail'

interface AuditTrailDisplayProps {
  auditTrail: AuditTrailEntry[]
  onFilterChange?: (filters: any) => void
}

export function AuditTrailDisplay({ auditTrail, onFilterChange }: AuditTrailDisplayProps) {
  const [selectedEntry, setSelectedEntry] = useState<AuditTrailEntry | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const statistics = calculateAuditStatistics(auditTrail)
  const complianceChecklist = generateComplianceChecklist(auditTrail)
  const suspiciousActivities = detectSuspiciousActivities(auditTrail)

  const toggleRowExpand = (id: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800 border-blue-300',
      warning: 'bg-orange-100 text-orange-800 border-orange-300',
      critical: 'bg-red-100 text-red-800 border-red-300',
    }
    return colors[severity] || colors.info
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'critical') {
      return <AlertTriangle className="h-4 w-4" />
    } else if (severity === 'warning') {
      return <AlertTriangle className="h-4 w-4" />
    }
    return <CheckCircle2 className="h-4 w-4" />
  }

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('approval')) return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (eventType.includes('rejection')) return <AlertTriangle className="h-4 w-4 text-red-600" />
    if (eventType.includes('escalation')) return <Zap className="h-4 w-4 text-orange-600" />
    if (eventType.includes('delegation')) return <Shield className="h-4 w-4 text-blue-600" />
    return <ActivitySquare className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <History className="h-6 w-6 text-blue-600" />
          Comprehensive Audit Trail
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          All administrative actions, decisions, and changes are logged for accountability and compliance
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Events</p>
          <p className="text-3xl font-bold text-blue-600">{statistics.totalEvents}</p>
          <p className="text-xs text-muted-foreground">All-time logged</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Critical Events
          </p>
          <p className="text-3xl font-bold text-red-600">{statistics.eventsBySeverity.critical}</p>
          <p className="text-xs text-muted-foreground">Requiring escalation</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Success Rate</p>
          <p className="text-3xl font-bold text-green-600">
            {(100 - statistics.failureRate).toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">{(statistics.failureRate).toFixed(1)}% failures</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Admins Tracked</p>
          <p className="text-3xl font-bold text-purple-600">{Object.keys(statistics.eventsByAdmin).length}</p>
          <p className="text-xs text-muted-foreground">Unique users</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="trail" className="space-y-6">
        <TabsList className="bg-card border border-border grid-cols-5">
          <TabsTrigger value="trail" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Trail</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts ({suspiciousActivities.length})</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
        </TabsList>

        {/* Audit Trail Tab */}
        <TabsContent value="trail" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Events</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-2">
            {auditTrail.slice(0, 20).map((entry) => (
              <div key={entry.id} className="border border-border rounded-lg bg-card overflow-hidden">
                <div
                  className="p-4 flex items-start justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleRowExpand(entry.id)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getEventIcon(entry.eventType)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-foreground text-sm">{entry.action}</h4>
                        <Badge className={getSeverityColor(entry.severity)}>
                          {getSeverityIcon(entry.severity)}
                          <span className="ml-1 text-xs">
                            {entry.severity.charAt(0).toUpperCase() + entry.severity.slice(1)}
                          </span>
                        </Badge>
                        <Badge
                          className={
                            entry.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : entry.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {entry.adminName} ({entry.adminRole})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEntry(entry)
                      setShowDetails(true)
                    }}
                  >
                    {expandedRows.has(entry.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {expandedRows.has(entry.id) && (
                  <div className="px-4 py-4 bg-muted/40 border-t border-border space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Resource</p>
                      <p className="font-mono text-foreground">
                        {entry.resourceType} #{entry.resourceId}
                      </p>
                    </div>
                    {entry.changes && entry.changes.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Changes</p>
                        <div className="space-y-1 font-mono text-xs">
                          {entry.changes.map((change, i) => (
                            <div key={i} className="text-foreground">
                              <strong>{change.field}:</strong> "{change.oldValue}" → "{change.newValue}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.relatedAdminName && (
                      <div>
                        <p className="text-xs text-muted-foreground">Related Admin</p>
                        <p className="font-medium text-foreground">{entry.relatedAdminName}</p>
                      </div>
                    )}
                    {entry.outcome && (
                      <div>
                        <p className="text-xs text-muted-foreground">Outcome</p>
                        <p className="text-foreground">{entry.outcome}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Dialog open={showDetails && !!selectedEntry} onOpenChange={setShowDetails}>
            {selectedEntry && (
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Audit Event Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Action</p>
                      <p className="font-semibold text-foreground">{selectedEntry.action}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Event Type</p>
                      <p className="font-semibold text-foreground">
                        {selectedEntry.eventType.replace(/_/g, ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Admin</p>
                      <p className="font-semibold text-foreground">{selectedEntry.adminName}</p>
                      <p className="text-xs text-muted-foreground">{selectedEntry.adminRole}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Jurisdiction</p>
                      <p className="font-semibold text-foreground">{selectedEntry.jurisdiction.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-foreground text-sm">{selectedEntry.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Badge className={getSeverityColor(selectedEntry.severity)}>
                      {selectedEntry.severity}
                    </Badge>
                    <Badge
                      className={
                        selectedEntry.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {selectedEntry.status}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {new Date(selectedEntry.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Event Distribution
            </h3>

            <div className="space-y-3">
              {Object.entries(statistics.eventsByType)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-foreground">{type.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-foreground">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / statistics.totalEvents) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Top Admins by Activity</h3>
            <div className="space-y-2">
              {Object.entries(statistics.eventsByAdmin)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([admin, count]) => (
                  <div key={admin} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium text-foreground">{admin}</span>
                    <Badge className="bg-blue-100 text-blue-800">{count} events</Badge>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="space-y-3">
            {complianceChecklist.map((item, i) => (
              <Card
                key={i}
                className={`p-4 border-2 ${
                  item.status === 'compliant'
                    ? 'border-green-200 bg-green-50 dark:bg-green-950/20'
                    : item.status === 'warning'
                      ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'
                      : 'border-red-200 bg-red-50 dark:bg-red-950/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{item.item}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                  </div>
                  <Badge
                    className={
                      item.status === 'compliant'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'warning'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                    }
                  >
                    {item.status === 'compliant' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {item.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {item.status === 'non-compliant' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {suspiciousActivities.length > 0 ? (
            <div className="space-y-3">
              {suspiciousActivities.map((alert, i) => (
                <Card key={i} className="p-4 border-2 border-red-200 bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 dark:text-red-100">{alert.activity}</h4>
                      <p className="text-sm text-red-800 dark:text-red-200 mt-1">{alert.details}</p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                        Admins Involved: {alert.adminsInvolved.join(', ')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-green-50 dark:bg-green-950/20 border-2 border-green-200">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-900 dark:text-green-100">No Suspicious Activities Detected</p>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">System is operating normally</p>
            </Card>
          )}
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Export Audit Reports</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Full Audit Trail (CSV)
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Compliance Report (PDF)
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Statistics Summary (PDF)
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Suspicious Activities Log (PDF)
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
