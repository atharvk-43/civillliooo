"use client"

import { AlertCircle, CheckCircle, Clock } from "lucide-react"

export function SystemStatus() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="stat-card flex items-center gap-4">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        <div>
          <p className="kpi-label">System Status</p>
          <p className="kpi-value text-green-600 dark:text-green-400">Operational</p>
        </div>
      </div>

      <div className="stat-card flex items-center gap-4">
        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div>
          <p className="kpi-label">Last Update</p>
          <p className="kpi-value text-foreground">2 minutes ago</p>
        </div>
      </div>

      <div className="stat-card flex items-center gap-4">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        <div>
          <p className="kpi-label">Active Alerts</p>
          <p className="kpi-value text-yellow-600 dark:text-yellow-400">3</p>
        </div>
      </div>
    </div>
  )
}
