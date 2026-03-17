import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

export interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  trend?: {
    value: number
    direction: "up" | "down"
    period: string
  }
  icon?: React.ReactNode
  variant?: "default" | "accent" | "warning"
}

export function KPICard({ label, value, unit, trend, icon, variant = "default" }: KPICardProps) {
  const variantClasses = {
    default: "bg-card border-border",
    accent: "bg-accent/10 dark:bg-accent/5 border-accent/30",
    warning: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900",
  }

  const trendColor = trend?.direction === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"

  return (
    <div className={`stat-card border ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="kpi-label">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="kpi-value">
              {value}
              {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
            </p>
          </div>
        </div>
        {icon && <div className="text-2xl opacity-80">{icon}</div>}
      </div>

      {trend && (
        <div className="pt-4 border-t border-border flex items-center gap-2">
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            {trend.direction === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">{trend.period}</span>
        </div>
      )}
    </div>
  )
}
