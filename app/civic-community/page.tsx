'use client'

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmartCityNewspaper } from "@/components/newspaper/smart-city-newspaper"
import { CivicSocialFeed } from "@/components/social/civic-social-feed"
import { CivicLeaderboard } from "@/components/civic/civic-leaderboard"
import { Button } from "@/components/ui/button"
import { Newspaper, Users, Trophy, Zap, Share2 } from "lucide-react"

export default function CivicCommunityPage() {
  const { role } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("newspaper")

  useEffect(() => {
    if (role !== "citizen") {
      router.push("/login")
    }
  }, [role, router])

  if (role !== "citizen") return null

  return (
    <>
      <AppHeader />
      <PageContainer>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="border-b border-border pb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">Civilio Community Hub</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Where citizens unite to identify problems, share solutions, celebrate achievements, and build a better city through transparency and collective action. Your voice matters—document real issues, showcase genuine impact, and earn recognition through verified civic contributions.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Your Civic Points</p>
              <p className="text-3xl font-bold text-yellow-600 flex items-center gap-2">
                <Zap className="h-8 w-8" />
                450
              </p>
              <p className="text-xs text-muted-foreground">Rank: 12th in city</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Issues Reported</p>
              <p className="text-3xl font-bold text-blue-600">8</p>
              <p className="text-xs text-muted-foreground">6 resolved, 2 in progress</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Community Support</p>
              <p className="text-3xl font-bold text-green-600">234</p>
              <p className="text-xs text-muted-foreground">Likes & shares on posts</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Citizens Impacted</p>
              <p className="text-3xl font-bold text-purple-600">2,340</p>
              <p className="text-xs text-muted-foreground">By your reported issues</p>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border w-full justify-start overflow-x-auto">
              <TabsTrigger value="newspaper" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span>Civilio Times</span>
              </TabsTrigger>
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Community Feed</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="my-profile" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>My Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Civilio Times - Newspaper */}
            <TabsContent value="newspaper" className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
                <p className="text-muted-foreground max-w-3xl">
                  Civilio Times showcases the most inspiring citizens, government achievements, and community-driven solutions. These are the real stories of how our city is becoming better—one informed action at a time. Citizens featured here show genuine dedication to public welfare and are recognized as civic leaders.
                </p>
              </div>
              <SmartCityNewspaper />
            </TabsContent>

            {/* Community Feed */}
            <TabsContent value="feed" className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border border-green-200 dark:border-green-900 rounded-lg p-6">
                <p className="text-muted-foreground max-w-3xl mb-4">
                  The civic feed is our social network for governance. Share problems with detailed documentation, propose solutions, celebrate government achievements, and engage with your community. Like Instagram meets civic responsibility—posts with images and proof drive real accountability.
                </p>
                <Button className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Post Your Issue
                </Button>
              </div>
              <CivicSocialFeed />
            </TabsContent>

            {/* Leaderboard */}
            <TabsContent value="leaderboard" className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-6">
                <p className="text-muted-foreground max-w-3xl">
                  Civic Points are earned through verified contributions—filing detailed grievances, sharing evidence-based solutions, providing feedback, and proving implementation impact. Only genuine work with documentation earns points. This leaderboard celebrates citizens who actually make our city better.
                </p>
              </div>
              <CivicLeaderboard />
            </TabsContent>

            {/* My Profile */}
            <TabsContent value="my-profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      RS
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Rajesh Kumar</h2>
                      <p className="text-muted-foreground text-sm">Vijay Nagar, Indore</p>
                    </div>
                    <div className="border-t border-border pt-4 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Civic Points</p>
                        <p className="text-2xl font-bold text-yellow-600">450</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Rank</p>
                        <p className="text-2xl font-bold text-blue-600">#12</p>
                      </div>
                    </div>
                    <Button className="w-full">Edit Profile</Button>
                  </div>
                </div>

                {/* Contributions & Stats */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-bold text-foreground mb-4">Your Civic Contributions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded">
                        <span className="text-sm">Issues Reported & Documented</span>
                        <span className="font-bold">8</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded">
                        <span className="text-sm">Solutions Proposed</span>
                        <span className="font-bold">3</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded">
                        <span className="text-sm">Impact Verified</span>
                        <span className="font-bold">2</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded">
                        <span className="text-sm">Featured in Civilio Times</span>
                        <span className="font-bold text-purple-600">1</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-bold text-foreground mb-4">How to Earn More Points</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>✓ File detailed grievances with location & images: +50-100 pts</p>
                      <p>✓ Provide solution ideas with evidence: +75-150 pts</p>
                      <p>✓ Track progress & give verified feedback: +25-50 pts</p>
                      <p>✓ Document proof of implemented solutions: +200+ pts</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  )
}
