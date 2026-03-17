"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Trophy, TrendingUp, MapPin, CheckCircle2, Heart } from "lucide-react"
import Image from "next/image"

interface FeaturedLeader {
  name: string
  localityName: string
  profileId: string
  totalPoints: number
  issuesReported: number
  issuesResolved: number
  verifiedOutcomes: number
  rank: string
  image: string
  bio: string
}

const mockTopLeader: FeaturedLeader = {
  name: "Priya Sharma",
  localityName: "North Ward",
  profileId: "PS-2024-001",
  totalPoints: 850,
  issuesReported: 12,
  issuesResolved: 11,
  verifiedOutcomes: 9,
  rank: "Platinum Citizen",
  image: "/images/civic-leaders/civic-leader-1.jpg",
  bio: "Leading civic participation in water infrastructure improvement and sustainable community development"
}

export function FeaturedCivilLeaderCard() {
  const [voted, setVoted] = useState(false)

  return (
    <Card className="overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Top Civic Leader</CardTitle>
          </div>
          <Badge className="bg-yellow-500 text-white">Voting Eligible</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Leader Image and Basic Info */}
        <div className="flex gap-4">
          <div className="relative h-32 w-32 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={mockTopLeader.image}
              alt={mockTopLeader.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-2">
              <div className="text-white">
                <p className="font-bold text-sm">{mockTopLeader.totalPoints}</p>
                <p className="text-xs">Points</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-bold text-lg text-foreground">{mockTopLeader.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {mockTopLeader.localityName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">ID: {mockTopLeader.profileId}</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-2">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-200 flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {mockTopLeader.rank}
              </p>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="space-y-3 border-t border-border pt-3">
          <p className="text-sm font-semibold text-foreground">{mockTopLeader.bio}</p>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-2 text-center">
              <p className="text-xs text-muted-foreground">Reported</p>
              <p className="font-bold text-foreground">{mockTopLeader.issuesReported}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded p-2 text-center">
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="font-bold text-green-700">{mockTopLeader.issuesResolved}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded p-2 text-center">
              <p className="text-xs text-muted-foreground">Verified</p>
              <p className="font-bold text-purple-700">{mockTopLeader.verifiedOutcomes}</p>
            </div>
          </div>
        </div>

        {/* Resolution Rate Progress */}
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">Resolution Rate</span>
            <span className="font-bold text-green-600">
              {Math.round((mockTopLeader.issuesResolved / mockTopLeader.issuesReported) * 100)}%
            </span>
          </div>
          <Progress value={(mockTopLeader.issuesResolved / mockTopLeader.issuesReported) * 100} className="h-2" />
        </div>

        {/* Vote Button */}
        <Button
          onClick={() => setVoted(!voted)}
          className={`w-full ${voted ? "bg-primary" : "bg-primary hover:bg-primary/90"}`}
        >
          {voted ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Voted for Upcoming Elections
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 mr-2" />
              Vote for Elections
            </>
          )}
        </Button>

        {/* Call to Action */}
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center">
          <p className="text-xs text-green-700 dark:text-green-200 font-semibold flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Your vote can directly influence civic leadership for next term
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
