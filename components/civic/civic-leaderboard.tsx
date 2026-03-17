'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Award, TrendingUp, Zap, Target } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  citizenName: string
  avatarUrl?: string
  civicPoints: number
  engagementScore: number
  featured: boolean
  contributions: number
  neighborhood: string
  topActivity: string
}

export function CivicLeaderboard() {
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      citizenName: 'Priya Sharma',
      civicPoints: 850,
      engagementScore: 94,
      featured: true,
      contributions: 24,
      neighborhood: 'Vijay Nagar',
      topActivity: 'Infrastructure Advocacy'
    },
    {
      rank: 2,
      citizenName: 'Rajesh Kumar',
      civicPoints: 720,
      engagementScore: 87,
      featured: true,
      contributions: 18,
      neighborhood: 'Palasia',
      topActivity: 'Waste Management'
    },
    {
      rank: 3,
      citizenName: 'Anjali Verma',
      civicPoints: 680,
      engagementScore: 85,
      featured: false,
      contributions: 16,
      neighborhood: 'Navlakha',
      topActivity: 'Public Health'
    },
    {
      rank: 4,
      citizenName: 'Vikram Singh',
      civicPoints: 620,
      engagementScore: 81,
      featured: false,
      contributions: 14,
      neighborhood: 'Rau',
      topActivity: 'Traffic Management'
    },
    {
      rank: 5,
      citizenName: 'Deepa Nair',
      civicPoints: 580,
      engagementScore: 78,
      featured: false,
      contributions: 12,
      neighborhood: 'Azad Nagar',
      topActivity: 'Water Supply'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          Civic Leadership Leaderboard
        </h2>
        <p className="text-muted-foreground">Celebrating citizens who are making our city better through genuine engagement and actionable contributions.</p>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="points" className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="points">Civic Points</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Score</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="featured">Featured Citizens</TabsTrigger>
        </TabsList>

        {/* Points Leaderboard */}
        <TabsContent value="points" className="space-y-4 mt-6">
          <div className="space-y-3">
            {mockLeaderboard.map((entry) => (
              <Card key={entry.rank} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                      entry.rank === 1 ? 'bg-yellow-500' :
                      entry.rank === 2 ? 'bg-gray-400' :
                      entry.rank === 3 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {entry.rank}
                    </div>
                  </div>

                  {/* Citizen Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.avatarUrl} />
                        <AvatarFallback>{entry.citizenName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground truncate">{entry.citizenName}</p>
                          {entry.featured && (
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.neighborhood} • {entry.topActivity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Civic Points */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-3 py-2 rounded-lg">
                      <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <p className="font-bold text-yellow-700 dark:text-yellow-300">{entry.civicPoints}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Engagement Score */}
        <TabsContent value="engagement" className="space-y-4 mt-6">
          <div className="space-y-3">
            {[...mockLeaderboard].sort((a, b) => b.engagementScore - a.engagementScore).map((entry, index) => (
              <Card key={entry.rank} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white bg-blue-500">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{entry.citizenName}</p>
                    <p className="text-xs text-muted-foreground">{entry.neighborhood}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-blue-600">{entry.engagementScore}%</div>
                    <div className="w-24 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{width: `${entry.engagementScore}%`}}></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contributions */}
        <TabsContent value="contributions" className="space-y-4 mt-6">
          <div className="space-y-3">
            {[...mockLeaderboard].sort((a, b) => b.contributions - a.contributions).map((entry, index) => (
              <Card key={entry.rank} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white bg-green-500">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{entry.citizenName}</p>
                    <p className="text-xs text-muted-foreground">{entry.topActivity}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-green-600">{entry.contributions}</div>
                    <p className="text-xs text-muted-foreground">contributions</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Featured Citizens */}
        <TabsContent value="featured" className="space-y-4 mt-6">
          <div className="space-y-3">
            {mockLeaderboard.filter(e => e.featured).map((entry) => (
              <Card key={entry.rank} className="p-4 border-2 border-purple-200 bg-purple-50 dark:bg-purple-950/30">
                <div className="flex items-center gap-4">
                  <Award className="h-10 w-10 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{entry.citizenName}</p>
                    <p className="text-xs text-muted-foreground mb-2">{entry.neighborhood}</p>
                    <Badge variant="outline" className="text-xs">Featured in Civilio Times</Badge>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <Zap className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                    <p className="font-bold text-foreground text-sm">{entry.civicPoints}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* How to Earn Points Info */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          How to Earn Civic Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Report & Document</p>
            <p className="text-muted-foreground">File detailed grievances with images: +50-100 points</p>
          </div>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Track Progress</p>
            <p className="text-muted-foreground">Monitor resolutions & provide feedback: +25-50 points</p>
          </div>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Community Solutions</p>
            <p className="text-muted-foreground">Share actionable solutions: +75-150 points</p>
          </div>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Positive Impact</p>
            <p className="text-muted-foreground">Prove implemented solutions with before/after: +200+ points</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
