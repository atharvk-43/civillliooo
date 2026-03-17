"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Grievance {
  id: string
  name: string
  issueType: string
  description: string
  location: string
  status: string
  date: string
  trackingId: string
}

interface GrievanceHistoryProps {
  grievances: Grievance[]
}

const statusConfig = {
  Submitted: {
    icon: Clock,
    color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200",
    label: "Submitted",
  },
  "In Review": {
    icon: AlertCircle,
    color: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200",
    label: "In Review",
  },
  Assigned: {
    icon: AlertCircle,
    color: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200",
    label: "Assigned",
  },
  Resolved: {
    icon: CheckCircle,
    color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200",
    label: "Resolved",
  },
}

export function GrievanceHistory({ grievances }: GrievanceHistoryProps) {
  return (
    <div className="space-y-4">
      {grievances.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-2">No grievances submitted yet</p>
          <p className="text-sm text-muted-foreground">Submit your first grievance to track its status here</p>
        </Card>
      ) : (
        grievances.map((grievance) => {
          const status = statusConfig[grievance.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <Card
              key={grievance.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{grievance.issueType}</h3>
                    <Badge className={`flex items-center gap-1 ${status.color}`} variant="secondary">
                      <StatusIcon className="h-3 w-3" />
                      <span className="text-xs">{status.label}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{grievance.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Location:</span>
                      <span className="text-foreground font-medium">{grievance.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Submitted:</span>
                      <span className="text-foreground font-medium">{grievance.date}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Tracking ID:</span>
                      <span className="text-foreground font-medium font-mono">{grievance.trackingId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Name:</span>
                      <span className="text-foreground font-medium">{grievance.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last updated: {grievance.date}</span>
                </div>
              </div>
            </Card>
          )
        })
      )}
    </div>
  )
}
