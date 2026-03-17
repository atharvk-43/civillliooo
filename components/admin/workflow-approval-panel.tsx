'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { AlertCircle, CheckCircle, Clock, FileText, ChevronRight, Zap, AlertTriangle } from 'lucide-react'
import type { Escalation, Delegation, WorkflowApproval } from '@/lib/workflows'
import { processEscalationApproval, processDelegationApproval, getEscalationAuditMessage } from '@/lib/workflows'

interface WorkflowApprovalPanelProps {
  pendingApprovals: WorkflowApproval[]
  onApprovalSubmitted: (approvalId: number, approved: boolean) => void
}

export function WorkflowApprovalPanel({ pendingApprovals, onApprovalSubmitted }: WorkflowApprovalPanelProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<WorkflowApproval | null>(null)
  const [approvalForm, setApprovalForm] = useState({
    decision: 'approve' as 'approve' | 'reject',
    comments: '',
  })

  const handleApprovalDecision = async () => {
    if (selectedApproval) {
      onApprovalSubmitted(selectedApproval.workflowId, approvalForm.decision === 'approve')
      setShowApprovalDialog(false)
      setApprovalForm({ decision: 'approve', comments: '' })
      setSelectedApproval(null)
    }
  }

  const getApprovalIcon = (workflowType: string) => {
    if (workflowType === 'escalation') {
      return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
    return <Zap className="h-5 w-5 text-blue-600" />
  }

  const getUrgencyColor = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilDue <= 1) return 'bg-red-100 border-red-300'
    if (daysUntilDue <= 3) return 'bg-orange-100 border-orange-300'
    return 'bg-yellow-100 border-yellow-300'
  }

  if (pendingApprovals.length === 0) {
    return (
      <Card className="p-8 text-center bg-muted/50 border-dashed border-2">
        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground font-medium">No pending approvals</p>
        <p className="text-sm text-muted-foreground mt-1">All workflows are up to date</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="h-6 w-6 text-orange-600" />
          Pending Approvals
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{pendingApprovals.length} item(s) awaiting your action</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>All ({pendingApprovals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="escalations" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Escalations ({pendingApprovals.filter((a) => a.workflowType === 'escalation').length})</span>
          </TabsTrigger>
          <TabsTrigger value="delegations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Delegations ({pendingApprovals.filter((a) => a.workflowType === 'delegation').length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {pendingApprovals.map((approval) => (
            <Card key={approval.id} className={`border-2 p-6 ${getUrgencyColor(approval.dueDate)}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {getApprovalIcon(approval.workflowType)}
                  <div>
                    <h3 className="font-bold text-foreground">{approval.documentDetails}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {approval.workflowType === 'escalation' ? 'Escalation Request' : 'Delegation Request'} • Submitted:{' '}
                      {approval.submissionDate}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due: {approval.dueDate}
                </Badge>
              </div>

              <div className="bg-white dark:bg-slate-950 rounded-lg p-4 mb-4 border border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Current Approval Level:</strong> {approval.currentLevel.replace(/_/g, ' ').toUpperCase()}
                </p>
                {approval.nextLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Next:</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium">{approval.nextLevel.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Dialog open={showApprovalDialog && selectedApproval?.id === approval.id} onOpenChange={setShowApprovalDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setSelectedApproval(approval)
                        setApprovalForm({ ...approvalForm, decision: 'approve' })
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </DialogTrigger>
                  {selectedApproval?.id === approval.id && (
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Approve {approval.workflowType === 'escalation' ? 'Escalation' : 'Delegation'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-muted p-3 rounded border border-border">
                          <p className="text-xs text-muted-foreground">Item:</p>
                          <p className="font-semibold text-foreground">{approval.documentDetails}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Additional Comments (Optional)</label>
                          <Textarea
                            placeholder="Add any comments or conditions for this approval..."
                            className="bg-background"
                            value={approvalForm.comments}
                            onChange={(e) =>
                              setApprovalForm({
                                ...approvalForm,
                                comments: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={() => setShowApprovalDialog(false)}>
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handleApprovalDecision}
                          >
                            Confirm Approval
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>

                <Dialog open={showApprovalDialog && selectedApproval?.id === approval.id && approvalForm.decision === 'reject'} onOpenChange={setShowApprovalDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setSelectedApproval(approval)
                        setApprovalForm({ ...approvalForm, decision: 'reject' })
                      }}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  {selectedApproval?.id === approval.id && approvalForm.decision === 'reject' && (
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Reject {approval.workflowType === 'escalation' ? 'Escalation' : 'Delegation'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-muted p-3 rounded border border-border">
                          <p className="text-xs text-muted-foreground">Item:</p>
                          <p className="font-semibold text-foreground">{approval.documentDetails}</p>
                        </div>
                        <div className="bg-red-100 dark:bg-red-950/30 rounded p-3 border border-red-300">
                          <p className="text-sm text-red-800 dark:text-red-200">
                            <strong>Warning:</strong> Rejecting this request will require the initiator to resubmit with modifications.
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Reason for Rejection</label>
                          <Textarea
                            placeholder="Explain why you are rejecting this request..."
                            className="bg-background"
                            value={approvalForm.comments}
                            onChange={(e) =>
                              setApprovalForm({
                                ...approvalForm,
                                comments: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={() => setShowApprovalDialog(false)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleApprovalDecision}
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          {pendingApprovals
            .filter((a) => a.workflowType === 'escalation')
            .map((approval) => (
              <Card key={approval.id} className={`border-2 p-6 ${getUrgencyColor(approval.dueDate)}`}>
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{approval.documentDetails}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Escalation Request</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    View Full Escalation
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" size="sm">
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" size="sm">
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="delegations" className="space-y-4">
          {pendingApprovals
            .filter((a) => a.workflowType === 'delegation')
            .map((approval) => (
              <Card key={approval.id} className={`border-2 p-6 ${getUrgencyColor(approval.dueDate)}`}>
                <div className="flex items-start gap-3 mb-4">
                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{approval.documentDetails}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Delegation Request</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    View Full Delegation
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" size="sm">
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" size="sm">
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
