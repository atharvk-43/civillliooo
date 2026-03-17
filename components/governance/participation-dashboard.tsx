"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, CheckCircle, AlertCircle, Heart, Share2 } from "lucide-react"

interface GrievanceImpact {
  grievanceId: string
  title: string
  status: "Resolved" | "In Progress" | "Pending"
  impact: "High" | "Medium" | "Low"
  resolutionDate?: string
  citizensAffected: number
  communityUpvotes: number
}

interface ParticipationMetrics {
  totalGrievances: number
  resolvedCount: number
  resolutionRate: number
  averageResolutionDays: number
  communityEngagementScore: number
  trustScore: number
}

interface ParticipationDashboardProps {
  metrics: ParticipationMetrics
  grievanceImpacts: GrievanceImpact[]
  userName: string
}

const impactBadgeColor = {
  High: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200",
  Medium: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200",
  Low: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200",
}

const statusConfig = {
  Resolved: { icon: CheckCircle, color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200" },
  "In Progress": { icon: AlertCircle, color: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200" },
  Pending: { icon: AlertCircle, color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200" },
}

export function ParticipationDashboard({
  metrics,
  grievanceImpacts,
  userName,
}: ParticipationDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Governance Impact</h2>
        <p className="text-muted-foreground">
          See how your participation is making a difference in our city and community decisions
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resolution Rate */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Resolution Rate</p>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">{metrics.resolutionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">of your grievances resolved</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <Progress value={metrics.resolutionRate} className="h-2" />
        </Card>

        {/* Community Engagement Score */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Community Score</p>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{metrics.communityEngagementScore}/100</div>
              <p className="text-xs text-muted-foreground mt-1">community participation index</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <Progress value={metrics.communityEngagementScore} className="h-2" />
        </Card>

        {/* Trust Score */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Government Trust</p>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{metrics.trustScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">based on your experience</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <Progress value={metrics.trustScore} className="h-2" />
        </Card>
      </div>

      {/* Response Time Metric */}
      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Average Response Time</h3>
            <p className="text-sm text-muted-foreground">Time taken to acknowledge your grievances</p>
          </div>
          <div className="text-4xl font-bold text-blue-600">{metrics.averageResolutionDays}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          Our city average: 3 business days. Your average is within the expected range.
        </div>
      </Card>

      {/* Impact Breakdown */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Your Grievance Impact</h3>
        <p className="text-sm text-muted-foreground mb-6">
          See how your reports have influenced city decisions and affected your community
        </p>

        <div className="space-y-4">
          {grievanceImpacts.map((grievance, index) => {
            const StatusIcon = statusConfig[grievance.status].icon

            return (
              <Card key={grievance.grievanceId} className="p-5 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{grievance.title}</h4>
                      <Badge className={impactBadgeColor[grievance.impact]}>
                        {grievance.impact} Impact
                      </Badge>
                      <Badge className={statusConfig[grievance.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {grievance.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Community Members Affected</p>
                    <p className="text-lg font-semibold text-foreground">{grievance.citizensAffected.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Community Upvotes</p>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <p className="text-lg font-semibold text-foreground">{grievance.communityUpvotes}</p>
                    </div>
                  </div>
                  {grievance.resolutionDate && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Resolved On</p>
                      <p className="text-lg font-semibold text-foreground">{grievance.resolutionDate}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">Your participation helped improve city governance</p>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-xs">
                    <Share2 className="h-4 w-4" />
                    Share Impact
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Transparency Notice */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How We Calculate Public Value</h4>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Impact:</strong> Based on the number of citizens affected and community validation
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Responsiveness:</strong> Measured by resolution time and government acknowledgment
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Trust:</strong> Built on transparent communication and consistent follow-through
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Community:</strong> Measured by citizen engagement and collective problem-solving
            </span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
