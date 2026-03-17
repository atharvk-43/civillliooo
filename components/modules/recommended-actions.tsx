"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export interface ActionItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  category: string
}

export interface RecommendedActionsProps {
  actions: ActionItem[]
  onAction?: (actionId: string) => void
}

export function RecommendedActions({ actions, onAction }: RecommendedActionsProps) {
  const priorityColor = {
    high: "border-l-4 border-l-red-600 dark:border-l-red-400",
    medium: "border-l-4 border-l-yellow-600 dark:border-l-yellow-400",
    low: "border-l-4 border-l-blue-600 dark:border-l-blue-400",
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Recommended Actions</h3>

      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`bg-muted/50 rounded-lg p-4 ${priorityColor[action.priority]} hover:bg-muted transition-colors`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">
                    {action.category}
                  </span>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                      action.priority === "high"
                        ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-200"
                        : action.priority === "medium"
                          ? "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-200"
                          : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-200"
                    }`}
                  >
                    {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onAction?.(action.id)} className="flex-shrink-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
