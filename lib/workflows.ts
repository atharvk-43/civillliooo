import { AdminProfile } from './user-context'

export type WorkflowStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed'
export type ApprovalLevel = 'department_head' | 'district_magistrate' | 'chief_minister'
export type ActionType = 'escalation' | 'delegation' | 'resource_request'

export interface ApprovalChainStep {
  id: number
  level: ApprovalLevel
  approverRole: string
  approverId?: number
  approvalDate?: string
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
}

export interface Escalation {
  id: number
  grievanceId: number
  grievanceTitle: string
  initiatedBy: {
    id: number
    name: string
    role: string
  }
  initiatedDate: string
  reason: string
  severity: 'medium' | 'high' | 'critical'
  approvalChain: ApprovalChainStep[]
  status: WorkflowStatus
  targetLevel: ApprovalLevel
  resolution?: string
  resolutionDate?: string
}

export interface Delegation {
  id: number
  delegatingAdmin: {
    id: number
    name: string
    role: string
  }
  delegateTo: {
    id: number
    name: string
    role: string
  }
  scope: string
  jurisdiction: {
    id: number
    name: string
  }
  startDate: string
  endDate?: string
  reason?: string
  approvalChain: ApprovalChainStep[]
  status: WorkflowStatus
  permissions: string[]
  constraints?: string
}

export interface WorkflowApproval {
  id: number
  workflowId: number
  workflowType: ActionType
  currentLevel: ApprovalLevel
  nextLevel?: ApprovalLevel
  approverDetails: {
    id: number
    name: string
    email: string
    role: string
  }
  documentDetails: string
  submissionDate: string
  dueDate: string
  status: 'awaiting_approval' | 'approved' | 'rejected' | 'requires_clarification'
}

/**
 * Determine the approval chain for an escalation based on severity
 */
export function getEscalationApprovalChain(severity: Escalation['severity']): ApprovalChainStep[] {
  const baseChain: ApprovalChainStep[] = [
    {
      id: 1,
      level: 'district_magistrate',
      approverRole: 'District Magistrate',
      status: 'pending',
    },
  ]

  if (severity === 'high' || severity === 'critical') {
    baseChain.push({
      id: 2,
      level: 'chief_minister',
      approverRole: 'Chief Minister',
      status: 'pending',
    })
  }

  return baseChain
}

/**
 * Determine the approval chain for a delegation based on delegation scope
 */
export function getDelegationApprovalChain(delegatingRole: string, scope: string): ApprovalChainStep[] {
  // District Magistrate delegation needs CM approval
  if (delegatingRole === 'district_magistrate') {
    return [
      {
        id: 1,
        level: 'chief_minister',
        approverRole: 'Chief Minister',
        status: 'pending',
      },
    ]
  }

  // Mayor delegation needs DM approval
  if (delegatingRole === 'mayor') {
    return [
      {
        id: 1,
        level: 'district_magistrate',
        approverRole: 'District Magistrate',
        status: 'pending',
      },
    ]
  }

  // Department head delegation needs immediate superior approval
  if (delegatingRole === 'department_head') {
    return [
      {
        id: 1,
        level: 'district_magistrate',
        approverRole: 'District Magistrate',
        status: 'pending',
      },
    ]
  }

  return []
}

/**
 * Check if an admin can approve a workflow at a given level
 */
export function canApproveWorkflow(admin: AdminProfile, approvalLevel: ApprovalLevel): boolean {
  const roleHierarchy: Record<string, number> = {
    chief_minister: 1,
    district_magistrate: 2,
    deputy_district_magistrate: 3,
    mayor: 4,
    municipal_commissioner: 5,
    department_head: 6,
  }

  const levelHierarchy: Record<ApprovalLevel, number> = {
    department_head: 6,
    district_magistrate: 2,
    chief_minister: 1,
  }

  const adminLevel = roleHierarchy[admin.adminRole]
  const requiredLevel = levelHierarchy[approvalLevel]

  // Can only approve if admin role is at or above the required level
  return adminLevel <= requiredLevel
}

/**
 * Process escalation approval
 */
export function processEscalationApproval(
  escalation: Escalation,
  approvingAdmin: AdminProfile,
  approved: boolean,
  comments?: string
): Escalation {
  const updatedEscalation = { ...escalation }
  const currentStep = updatedEscalation.approvalChain.find((step) => step.status === 'pending')

  if (!currentStep) {
    return updatedEscalation
  }

  // Update current step
  currentStep.status = approved ? 'approved' : 'rejected'
  currentStep.approverDate = new Date().toISOString().split('T')[0]
  currentStep.approverId = approvingAdmin.id
  currentStep.comments = comments

  if (!approved) {
    // If rejected, escalation ends
    updatedEscalation.status = 'rejected'
    return updatedEscalation
  }

  // Find next pending step
  const nextStep = updatedEscalation.approvalChain.find((step) => step.status === 'pending')

  if (!nextStep) {
    // All approvals complete
    updatedEscalation.status = 'approved'
  }

  return updatedEscalation
}

/**
 * Process delegation approval
 */
export function processDelegationApproval(
  delegation: Delegation,
  approvingAdmin: AdminProfile,
  approved: boolean,
  comments?: string
): Delegation {
  const updatedDelegation = { ...delegation }
  const currentStep = updatedDelegation.approvalChain.find((step) => step.status === 'pending')

  if (!currentStep) {
    return updatedDelegation
  }

  // Update current step
  currentStep.status = approved ? 'approved' : 'rejected'
  currentStep.approvalDate = new Date().toISOString().split('T')[0]
  currentStep.approverId = approvingAdmin.id
  currentStep.comments = comments

  if (!approved) {
    // If rejected, delegation is revoked
    updatedDelegation.status = 'rejected'
    return updatedDelegation
  }

  // Find next pending step
  const nextStep = updatedDelegation.approvalChain.find((step) => step.status === 'pending')

  if (!nextStep) {
    // All approvals complete
    updatedDelegation.status = 'in_progress'
  }

  return updatedDelegation
}

/**
 * Generate escalation audit trail message
 */
export function getEscalationAuditMessage(escalation: Escalation): string[] {
  const messages: string[] = []

  messages.push(`Escalation initiated on ${escalation.initiatedDate} by ${escalation.initiatedBy.name}`)
  messages.push(`Reason: ${escalation.reason}`)
  messages.push(`Severity Level: ${escalation.severity.toUpperCase()}`)

  escalation.approvalChain.forEach((step, index) => {
    const stepNumber = index + 1
    if (step.status === 'approved') {
      messages.push(`✓ Step ${stepNumber}: Approved by ${step.approverRole} (${step.approvalDate})`)
      if (step.comments) {
        messages.push(`  Comments: ${step.comments}`)
      }
    } else if (step.status === 'rejected') {
      messages.push(`✗ Step ${stepNumber}: Rejected by ${step.approverRole} (${step.approvalDate})`)
      if (step.comments) {
        messages.push(`  Reason: ${step.comments}`)
      }
    } else {
      messages.push(`⏳ Step ${stepNumber}: Awaiting approval from ${step.approverRole}`)
    }
  })

  if (escalation.resolution) {
    messages.push(`Resolution: ${escalation.resolution}`)
    messages.push(`Resolved on: ${escalation.resolutionDate}`)
  }

  return messages
}

/**
 * Generate delegation audit trail message
 */
export function getDelegationAuditMessage(delegation: Delegation): string[] {
  const messages: string[] = []

  messages.push(`Delegation initiated by ${delegation.delegatingAdmin.name}`)
  messages.push(`Delegating authority to: ${delegation.delegateTo.name}`)
  messages.push(`Scope: ${delegation.scope}`)
  messages.push(`Jurisdiction: ${delegation.jurisdiction.name}`)
  messages.push(`Effective from: ${delegation.startDate}`)

  if (delegation.endDate) {
    messages.push(`Valid until: ${delegation.endDate}`)
  }

  if (delegation.reason) {
    messages.push(`Delegation reason: ${delegation.reason}`)
  }

  messages.push(`\nApproval Chain:`)
  delegation.approvalChain.forEach((step, index) => {
    const stepNumber = index + 1
    if (step.status === 'approved') {
      messages.push(`✓ Step ${stepNumber}: Approved by ${step.approverRole} (${step.approvalDate})`)
    } else if (step.status === 'rejected') {
      messages.push(`✗ Step ${stepNumber}: Rejected by ${step.approverRole} (${step.approvalDate})`)
    } else {
      messages.push(`⏳ Step ${stepNumber}: Awaiting approval from ${step.approverRole}`)
    }
  })

  return messages
}

/**
 * Check if an escalation requires CM approval
 */
export function requiresCMApproval(escalation: Escalation): boolean {
  return escalation.approvalChain.some((step) => step.level === 'chief_minister')
}

/**
 * Get pending approvals for an admin
 */
export function getPendingApprovalsForAdmin(
  admin: AdminProfile,
  escalations: Escalation[],
  delegations: Delegation[]
): WorkflowApproval[] {
  const pendingApprovals: WorkflowApproval[] = []
  const adminLevel = getRoleLevel(admin.adminRole)

  // Check escalations
  escalations.forEach((escalation) => {
    const currentStep = escalation.approvalChain.find((step) => step.status === 'pending')
    if (currentStep && getRoleLevel(currentStep.level) >= adminLevel) {
      pendingApprovals.push({
        id: escalation.id,
        workflowId: escalation.id,
        workflowType: 'escalation',
        currentLevel: currentStep.level,
        nextLevel: escalation.approvalChain[escalation.approvalChain.findIndex((s) => s.id === currentStep.id) + 1]
          ?.level,
        approverDetails: {
          id: admin.id,
          name: admin.name,
          email: admin.email || '',
          role: admin.adminRole,
        },
        documentDetails: escalation.grievanceTitle,
        submissionDate: escalation.initiatedDate,
        dueDate: calculateDueDate(escalation.initiatedDate),
        status: 'awaiting_approval',
      })
    }
  })

  // Check delegations
  delegations.forEach((delegation) => {
    const currentStep = delegation.approvalChain.find((step) => step.status === 'pending')
    if (currentStep && getRoleLevel(currentStep.level) >= adminLevel) {
      pendingApprovals.push({
        id: delegation.id,
        workflowId: delegation.id,
        workflowType: 'delegation',
        currentLevel: currentStep.level,
        nextLevel: delegation.approvalChain[delegation.approvalChain.findIndex((s) => s.id === currentStep.id) + 1]
          ?.level,
        approverDetails: {
          id: admin.id,
          name: admin.name,
          email: admin.email || '',
          role: admin.adminRole,
        },
        documentDetails: `Delegation to ${delegation.delegateTo.name}`,
        submissionDate: new Date().toISOString().split('T')[0],
        dueDate: calculateDueDate(new Date().toISOString().split('T')[0]),
        status: 'awaiting_approval',
      })
    }
  })

  return pendingApprovals
}

/**
 * Helper: Get numeric level of a role for hierarchy comparison
 */
function getRoleLevel(role: string): number {
  const levels: Record<string, number> = {
    chief_minister: 1,
    district_magistrate: 2,
    deputy_district_magistrate: 3,
    mayor: 4,
    municipal_commissioner: 5,
    department_head: 6,
  }
  return levels[role] || 999
}

/**
 * Helper: Calculate due date for approval (default 5 business days)
 */
function calculateDueDate(startDate: string): string {
  const date = new Date(startDate)
  let businessDays = 0
  while (businessDays < 5) {
    date.setDate(date.getDate() + 1)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      businessDays++
    }
  }
  return date.toISOString().split('T')[0]
}
