"use client"

import React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, User, Users, Briefcase, FileText } from "lucide-react"

interface WorkflowStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  actor: string
  timeline: string
  status: "completed" | "current" | "pending"
  timestamp?: string
}

interface TransparentWorkflowProps {
  grievanceId: string
  steps: WorkflowStep[]
  auditTrail?: Array<{
    timestamp: string
    action: string
    actor: string
    details: string
  }>
}

const statusColors = {
  completed: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200",
  current: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200",
  pending: "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-200",
}

export function TransparentWorkflow({ grievanceId, steps, auditTrail }: TransparentWorkflowProps) {
  return (
    <div className="space-y-8">
      {/* Workflow Title */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">End-to-End Workflow</h3>
        <p className="text-sm text-muted-foreground">Track your grievance through every step of our system</p>
        <p className="text-xs text-muted-foreground mt-2">Reference ID: {grievanceId}</p>
      </div>

      {/* Process Flow */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-6 top-12 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-gray-200 dark:from-blue-700 dark:to-gray-700" />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative pl-20">
              {/* Step Icon */}
              <div
                className={`absolute left-0 top-0 h-12 w-12 rounded-full flex items-center justify-center border-4 border-background z-10 ${
                  statusColors[step.status]
                }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle className="h-6 w-6" />
                ) : step.status === "current" ? (
                  <Clock className="h-6 w-6 animate-pulse" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Step Card */}
              <Card
                className={`p-5 border transition-all ${
                  step.status === "current"
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 shadow-md"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <Badge className={`whitespace-nowrap ${statusColors[step.status]}`}>
                    {step.status === "completed"
                      ? "Completed"
                      : step.status === "current"
                        ? "In Progress"
                        : "Pending"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Responsible</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{step.actor}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Expected Timeline</p>
                    <p className="font-medium text-foreground">{step.timeline}</p>
                  </div>
                  {step.timestamp && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Completed On</p>
                      <p className="font-medium text-foreground">{step.timestamp}</p>
                    </div>
                  )}
                </div>

                {step.status === "current" && (
                  <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/40 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      This step is currently in progress. You will be notified when the next step begins.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      {auditTrail && auditTrail.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Audit Trail</h3>
          <p className="text-sm text-muted-foreground mb-4">Complete record of all actions taken on this grievance</p>

          <Card className="p-6 border border-border">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {auditTrail.map((entry, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
                  <div className="flex-shrink-0 pt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-foreground text-sm">{entry.action}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{entry.details}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{entry.actor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Process Explanation */}
      <Card className="p-6 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Our Commitment to Transparency</h4>
        <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
          Every step of your grievance is tracked and audited. We believe in complete transparency about who is handling
          your case, what actions are being taken, and when to expect updates.
        </p>
        <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
            <span>Every action is logged with timestamp and responsible officer</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
            <span>You receive notifications at each workflow stage</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
            <span>All decisions are documented and open for accountability</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
