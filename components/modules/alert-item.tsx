"use client"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AlertItemProps {
  severity: "info" | "warning" | "critical"
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function AlertItem({ severity, title, description, action }: AlertItemProps) {
  const severityConfig = {
    info: {
      icon: Info,
      className: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    warning: {
      icon: AlertTriangle,
      className: "alert-warning",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    critical: {
      icon: AlertCircle,
      className: "alert-critical",
      iconColor: "text-red-600 dark:text-red-400",
    },
  }

  const config = severityConfig[severity]
  const Icon = config.icon

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${config.className}`}>
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="flex-shrink-0 text-xs bg-transparent">
          {action.label}
        </Button>
      )}
    </div>
  )
}
