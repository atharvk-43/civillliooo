"use client"

import React from "react"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Users, Target, Zap, Scale } from "lucide-react"

interface PublicValueMetric {
  id: string
  name: string
  description: string
  current: number
  target: number
  unit: string
  trend: "up" | "down" | "stable"
  icon: React.ReactNode
}

interface PublicValueIndicatorsProps {
  cityName: string
  metrics: PublicValueMetric[]
  period: string
}

export function PublicValueIndicators({ cityName, metrics, period }: PublicValueIndicatorsProps) {
  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getTrendColor = (trend: string) => {
    return trend === "up"
      ? "text-green-600 dark:text-green-400"
      : trend === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-yellow-600 dark:text-yellow-400"
  }

  const getTrendBg = (trend: string) => {
    return trend === "up"
      ? "bg-green-50 dark:bg-green-950/30"
      : trend === "down"
        ? "bg-red-50 dark:bg-red-950/30"
        : "bg-yellow-50 dark:bg-yellow-950/30"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Public Value Dashboard</h2>
        <p className="text-muted-foreground">
          {cityName} Performance Metrics for {period} - Measuring responsive, equitable, and effective governance
        </p>
      </div>

      {/* Definition Box */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Understanding Public Value</h3>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
          Public value goes beyond efficiency. We measure success by:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
          <div className="flex gap-2">
            <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Responsiveness:</strong> How quickly we acknowledge and address citizen needs
            </span>
          </div>
          <div className="flex gap-2">
            <Scale className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Equity:</strong> Whether all citizens are served fairly regardless of location/status
            </span>
          </div>
          <div className="flex gap-2">
            <Users className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Participation:</strong> Extent of citizen involvement in governance decisions
            </span>
          </div>
          <div className="flex gap-2">
            <Target className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Quality:</strong> Lasting solutions that truly address root causes
            </span>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => {
          const percentage = getPercentage(metric.current, metric.target)

          return (
            <Card key={metric.id} className={`p-6 border border-border ${getTrendBg(metric.trend)}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{metric.name}</h3>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
                <div className="flex-shrink-0 p-3 bg-background rounded-lg">
                  {metric.icon}
                </div>
              </div>

              {/* Metric Values */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="bg-background rounded p-3">
                  <p className="text-muted-foreground text-xs mb-1">Current</p>
                  <p className="text-lg font-bold text-foreground">
                    {metric.current}
                    <span className="text-xs font-normal text-muted-foreground ml-1">{metric.unit}</span>
                  </p>
                </div>
                <div className="bg-background rounded p-3">
                  <p className="text-muted-foreground text-xs mb-1">Target</p>
                  <p className="text-lg font-bold text-foreground">
                    {metric.target}
                    <span className="text-xs font-normal text-muted-foreground ml-1">{metric.unit}</span>
                  </p>
                </div>
                <div className={`rounded p-3 flex flex-col justify-center items-center ${getTrendBg(metric.trend)}`}>
                  <TrendingUp className={`h-4 w-4 mb-1 ${getTrendColor(metric.trend)}`} />
                  <p className={`font-bold ${getTrendColor(metric.trend)}`}>{metric.trend}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Progress to Target</span>
                  <span className="text-xs font-bold text-foreground">{Math.round(percentage)}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>

              {/* Status Message */}
              {percentage >= 90 ? (
                <p className="text-xs text-green-700 dark:text-green-300">
                  On track! Approaching target goal.
                </p>
              ) : percentage >= 70 ? (
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Making progress. Increased efforts needed to reach target.
                </p>
              ) : (
                <p className="text-xs text-red-700 dark:text-red-300">
                  Needs attention. Action plan in place to improve performance.
                </p>
              )}
            </Card>
          )
        })}
      </div>

      {/* Accountability Section */}
      <Card className="p-6 border border-border bg-purple-50 dark:bg-purple-950/20">
        <h3 className="font-semibold text-foreground mb-3">How We Ensure Accountability</h3>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            These metrics are published monthly and tied directly to department funding and leadership performance
            reviews. Poor performance triggers:
          </p>
          <ul className="space-y-2 text-muted-foreground ml-4">
            <li className="flex gap-2">
              <span className="text-foreground font-semibold">1.</span>
              <span>Mandatory improvement plans from underperforming departments</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-semibold">2.</span>
              <span>Public explanation of challenges and proposed solutions</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-semibold">3.</span>
              <span>Budget reallocation to departments showing strong public value creation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-semibold">4.</span>
              <span>Leadership changes if metrics don't improve within 6 months</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Historical Trend */}
      <Card className="p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Trend Analysis</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How {cityName}'s public value indicators have changed over the last 6 months:
        </p>
        <div className="space-y-4">
          {metrics.slice(0, 3).map((metric) => (
            <div key={metric.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{metric.name}</span>
                <div className="flex items-center gap-2">
                  {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                  <span className={`text-sm font-bold ${getTrendColor(metric.trend)}`}>
                    {metric.trend === "up" ? "+5%" : metric.trend === "down" ? "-2%" : "stable"}
                  </span>
                </div>
              </div>
              <Progress value={getPercentage(metric.current, metric.target)} className="h-1" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
