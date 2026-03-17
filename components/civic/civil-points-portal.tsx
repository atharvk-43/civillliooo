"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Trophy, Zap, Target, Medal, Crown, MapPin, Users, Percent } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CivilPointsRecord {
  citizen_name: string
  total_points: number
  problems_reported: number
  problems_resolved: number
  verified_outcomes: number
  rank: string
  badge_level: string
  locality: string
}

interface LocalityCivilPoints {
  locality_name: string
  mla_name: string
  total_citizen_points: number
  problems_resolved: number
  resolution_rate: number
  rank: number
  active_citizens: number
}

const rankBadges: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
  "Platinum Citizen": { color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/30", icon: <Crown className="h-5 w-5" /> },
  "Gold Citizen": { color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/30", icon: <Trophy className="h-5 w-5" /> },
  "Silver Citizen": { color: "text-gray-600", bgColor: "bg-gray-50 dark:bg-gray-950/30", icon: <Medal className="h-5 w-5" /> },
  "Bronze Citizen": { color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950/30", icon: <Medal className="h-5 w-5" /> },
  "Active Civic Participant": { color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/30", icon: <Zap className="h-5 w-5" /> },
  "Emerging Civic Leader": { color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950/30", icon: <TrendingUp className="h-5 w-5" /> },
  "New Participant": { color: "text-gray-500", bgColor: "bg-gray-50 dark:bg-gray-950/30", icon: <Target className="h-5 w-5" /> },
}

export function CivilPointsPortal() {
  const [activeTab, setActiveTab] = useState("individual")
  const [leaderboard, setLeaderboard] = useState<CivilPointsRecord[]>([])
  const [localityData, setLocalityData] = useState<LocalityCivilPoints[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchData()
    loadMockData()
  }, [])

  const loadMockData = () => {
    const mockLeaderboard: CivilPointsRecord[] = [
      {
        citizen_name: "Priya Sharma",
        total_points: 850,
        problems_reported: 12,
        problems_resolved: 11,
        verified_outcomes: 9,
        rank: "Platinum Citizen",
        badge_level: "gold",
        locality: "North Ward"
      },
      {
        citizen_name: "Rajesh Kumar",
        total_points: 720,
        problems_reported: 8,
        problems_resolved: 7,
        verified_outcomes: 6,
        rank: "Gold Citizen",
        badge_level: "silver",
        locality: "East Zone"
      },
      {
        citizen_name: "Dr. Meera Patel",
        total_points: 680,
        problems_reported: 6,
        problems_resolved: 6,
        verified_outcomes: 5,
        rank: "Gold Citizen",
        badge_level: "silver",
        locality: "Central Ward"
      },
      {
        citizen_name: "Vikram Singh",
        total_points: 620,
        problems_reported: 10,
        problems_resolved: 8,
        verified_outcomes: 7,
        rank: "Silver Citizen",
        badge_level: "bronze",
        locality: "South Zone"
      },
      {
        citizen_name: "Anjali Desai",
        total_points: 590,
        problems_reported: 9,
        problems_resolved: 7,
        verified_outcomes: 6,
        rank: "Silver Citizen",
        badge_level: "bronze",
        locality: "West Ward"
      }
    ]

    const mockLocality: LocalityCivilPoints[] = [
      {
        locality_name: "North Ward",
        mla_name: "Priya Sharma",
        total_citizen_points: 3450,
        problems_resolved: 45,
        resolution_rate: 87,
        rank: 1,
        active_citizens: 12
      },
      {
        locality_name: "East Zone",
        mla_name: "Rajesh Kumar",
        total_citizen_points: 2890,
        problems_resolved: 38,
        resolution_rate: 82,
        rank: 2,
        active_citizens: 10
      },
      {
        locality_name: "Central Ward",
        mla_name: "Dr. Meera Patel",
        total_citizen_points: 2560,
        problems_resolved: 32,
        resolution_rate: 78,
        rank: 3,
        active_citizens: 9
      }
    ]

    setLeaderboard(mockLeaderboard)
    setLocalityData(mockLocality)
  }

  const fetchData = async () => {
    try {
      const [leaderboardRes, localityRes] = await Promise.all([
        fetch("/api/civil-points/leaderboard"),
        fetch("/api/civil-points/locality"),
      ])

      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json()
        if (data.data && data.data.length > 0) {
          setLeaderboard(data.data)
        }
      }

      if (localityRes.ok) {
        const data = await localityRes.json()
        if (data.data && data.data.length > 0) {
          setLocalityData(data.data)
        }
      }
    } catch (error) {
      console.warn("[v0] Could not fetch civil points, using mock data")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (citizenId: number) => {
    setVotes(prev => ({
      ...prev,
      [citizenId]: !prev[citizenId]
    }))
  }

  const filteredLeaderboard = selectedLocality
    ? leaderboard.filter(l => l.locality === selectedLocality)
    : leaderboard

  const getRankBadge = (rank: string) => {
    const badge = rankBadges[rank] || rankBadges["New Participant"]
    return badge
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="h-6 w-6 text-yellow-500" />
          <h2 className="text-3xl font-bold text-foreground">Civil Points Portal</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Earn Civil Points for reporting issues, resolving problems, and contributing to civic improvement. Track your progress and compete with others in your locality to make a real difference.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="individual">Individual Rankings</TabsTrigger>
          <TabsTrigger value="locality">Locality & MLA Rankings</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Badges</TabsTrigger>
        </TabsList>

        {/* Individual Rankings Tab */}
        <TabsContent value="individual" className="space-y-6">
          {/* Locality Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Filter by Locality</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLocality(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedLocality === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                All Localities
              </button>
              {Array.from(new Set(leaderboard.map(l => l.locality))).map(locality => (
                <button
                  key={locality}
                  onClick={() => setSelectedLocality(locality)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedLocality === locality
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {locality}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Civic Participants</CardTitle>
              <CardDescription>Citizens earning the most civil points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLeaderboard.slice(0, 20).map((citizen, index) => {
                  const badge = getRankBadge(citizen.rank)
                  const pointsPercentage = (citizen.total_points / (filteredLeaderboard[0]?.total_points || 1)) * 100
                  
                  return (
                    <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                            <div>
                              <h4 className="font-semibold text-foreground">{citizen.citizen_name}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {citizen.locality}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={`${badge.bgColor} ${badge.color} px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium`}>
                          {badge.icon}
                          {citizen.rank}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Points Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">Total Points</span>
                            <span className="text-sm font-bold text-primary">{citizen.total_points}</span>
                          </div>
                          <Progress value={pointsPercentage} className="h-2" />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-2">
                            <p className="text-xs text-muted-foreground">Reports</p>
                            <p className="font-bold text-foreground">{citizen.problems_reported}</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/30 rounded p-2">
                            <p className="text-xs text-muted-foreground">Resolved</p>
                            <p className="font-bold text-foreground">{citizen.problems_resolved}</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950/30 rounded p-2">
                            <p className="text-xs text-muted-foreground">Verified</p>
                            <p className="font-bold text-foreground">{citizen.verified_outcomes}</p>
                          </div>
                        </div>

                        {/* Vote Button for Elections */}
                        <div className="pt-3 border-t border-border flex gap-2">
                          <button
                            onClick={() => handleVote(index)}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                              votes[index]
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            <Percent className="h-4 w-4" />
                            {votes[index] ? "Voted" : "Vote for Elections"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locality Rankings Tab */}
        <TabsContent value="locality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Locality & MLA Performance</CardTitle>
              <CardDescription>Civic engagement metrics by area and elected representative</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {localityData.slice(0, 15).map((locality, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{locality.locality_name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          MLA: {locality.mla_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{locality.total_citizen_points}</div>
                        <p className="text-xs text-muted-foreground">Total Points</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Problems Resolved</p>
                        <p className="font-bold text-foreground">{locality.problems_resolved}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Active Citizens</p>
                        <p className="font-bold text-foreground">{locality.active_citizens}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Resolution Rate</p>
                        <p className="font-bold text-foreground">{locality.resolution_rate.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Performance</span>
                        <span className="text-xs font-bold text-primary">Rank #{locality.rank}</span>
                      </div>
                      <Progress value={(locality.resolution_rate || 0)} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards & Badges Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Civil Points Rewards System</CardTitle>
              <CardDescription>Earn badges and recognition for your civic contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badge Levels */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Achievement Levels</h4>
                {[
                  { name: "Platinum Citizen", points: "1000+", description: "Exceptional civic leader transforming communities" },
                  { name: "Gold Citizen", points: "500-999", description: "Dedicated advocate for civic improvement" },
                  { name: "Silver Citizen", points: "250-499", description: "Active and engaged community member" },
                  { name: "Bronze Citizen", points: "100-249", description: "Responsible civic participant" },
                  { name: "Active Civic Participant", points: "50-99", description: "Contributing member of the community" },
                  { name: "Emerging Civic Leader", points: "10-49", description: "Building civic awareness" },
                  { name: "New Participant", points: "0-9", description: "Starting your civic journey" },
                ].map(level => (
                  <div key={level.name} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${rankBadges[level.name]?.color || "bg-gray-500"} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                        {level.points}
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">{level.name}</h5>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Point Earning Guide */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  How to Earn Civil Points
                </h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">+5</span>
                    <span>Submit a grievance report about a community issue</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">+25</span>
                    <span>Report is reviewed and acknowledged by authorities</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">+50</span>
                    <span>Your reported issue is actively being resolved</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">+100</span>
                    <span>Issue is successfully resolved with your verification</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">+20</span>
                    <span>Report is featured in the Smart City Newsletter</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
