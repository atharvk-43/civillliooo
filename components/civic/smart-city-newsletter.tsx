"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Eye, ThumbsUp, Newspaper, Star, User, TrendingUp, MessageCircle, Heart } from "lucide-react"
import Image from "next/image"

interface Newsletter {
  id: number
  title: string
  content: string
  category?: string
  author_name?: string
  published_at?: string
  is_featured?: boolean
  view_count?: number
  thumbnail_url?: string
  impact_metric?: string
}

interface FeaturedCitizen {
  id: number
  citizen_name: string
  citizen_email: string
  profile_id: string
  grievance_title: string
  reason_featured: string
  image_url: string
  points_awarded: number
  locality: string
  issues_reported: number
  issues_resolved: number
}

interface NewsletterSection {
  id: string
  title: string
  description: string
  image: string
  date: string
  category: string
  impact: string
}

export function SmartCityNewsletterComponent() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [featured, setFeatured] = useState<FeaturedCitizen[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sections, setSections] = useState<NewsletterSection[]>([])

  useEffect(() => {
    fetchNewsletters()
    loadMockData()
  }, [])

  const loadMockData = () => {
    const mockSections: NewsletterSection[] = [
      {
        id: "1",
        title: "Major Water Supply Infrastructure Upgraded",
        description: "Following citizen reports, the city has successfully upgraded water supply infrastructure in North Ward. The project, initiated by civic leader Priya Sharma, resulted in uninterrupted water supply to 5,000+ households.",
        image: "/images/civic-events/government-response.jpg",
        date: "2024-01-20",
        category: "Infrastructure",
        impact: "5000+ residents benefited"
      },
      {
        id: "2",
        title: "Community-Led Road Safety Initiative",
        description: "After multiple accident reports in East Zone, community leader Rajesh Kumar organized awareness campaigns. The initiative led to installation of 15 new traffic signals and speed breakers, reducing accidents by 40%.",
        image: "/images/civic-events/civic-event-1.jpg",
        date: "2024-01-18",
        category: "Safety",
        impact: "40% reduction in accidents"
      },
      {
        id: "3",
        title: "Healthcare Access Improved in Underserved Areas",
        description: "Citizen-initiated health awareness drive by Dr. Meera Patel identified gaps in healthcare access. Result: New health center opened in Central Ward with 24/7 ambulance service.",
        image: "/images/civic-events/government-response.jpg",
        date: "2024-01-15",
        category: "Health",
        impact: "3000+ residents now have healthcare access"
      }
    ]

    const mockFeatured: FeaturedCitizen[] = [
      {
        id: 1,
        citizen_name: "Priya Sharma",
        citizen_email: "priya.sharma@civilio.com",
        profile_id: "CS-2024-001",
        grievance_title: "Water Supply Crisis in North Ward",
        reason_featured: "Persistent reporting and community mobilization led to successful infrastructure upgrade",
        image_url: "/images/civic-leaders/civic-leader-1.jpg",
        points_awarded: 850,
        locality: "North Ward",
        issues_reported: 12,
        issues_resolved: 11
      },
      {
        id: 2,
        citizen_name: "Rajesh Kumar",
        citizen_email: "rajesh.kumar@civilio.com",
        profile_id: "RK-2024-002",
        grievance_title: "Road Safety Campaign",
        reason_featured: "Community organizing and sustained advocacy for traffic safety improvements",
        image_url: "/images/civic-leaders/civic-leader-2.jpg",
        points_awarded: 720,
        locality: "East Zone",
        issues_reported: 8,
        issues_resolved: 7
      },
      {
        id: 3,
        citizen_name: "Dr. Meera Patel",
        citizen_email: "meera.patel@civilio.com",
        profile_id: "MP-2024-003",
        grievance_title: "Healthcare Access Initiative",
        reason_featured: "Led health awareness drive identifying critical healthcare gaps, resulting in new facility",
        image_url: "/images/civic-leaders/civic-leader-3.jpg",
        points_awarded: 680,
        locality: "Central Ward",
        issues_reported: 6,
        issues_resolved: 6
      }
    ]

    setSections(mockSections)
    setFeatured(mockFeatured)
  }

  const fetchNewsletters = async () => {
    try {
      const response = await fetch("/api/newsletters")
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setNewsletters(data.data || [])
      } else {
        // Fallback to mock data if API is unavailable
        setNewsletters([])
      }
    } catch (error) {
      console.warn("[v0] Could not fetch newsletters, using mock data")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", "infrastructure", "health", "education", "water", "sanitation", "governance"]

  const filteredNewsletters = selectedCategory === "all" 
    ? newsletters 
    : newsletters.filter(n => n.category?.toLowerCase() === selectedCategory)

  const featuredNewsletters = filteredNewsletters.filter(n => n.is_featured)
  const regularNewsletters = filteredNewsletters.filter(n => !n.is_featured)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <Newspaper className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Smart City Newsletter</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Stay informed about city updates, government actions, and stories from engaged citizens making a difference in our community.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Featured Newsletters */}
      {featuredNewsletters.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Stories
          </h3>
          <div className="grid gap-4">
            {featuredNewsletters.slice(0, 3).map(newsletter => (
              <Card key={newsletter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{newsletter.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {newsletter.category && (
                          <Badge variant="secondary" className="capitalize">{newsletter.category}</Badge>
                        )}
                        {newsletter.is_featured && (
                          <Badge variant="default" className="bg-yellow-600">Featured</Badge>
                        )}
                      </div>
                    </div>
                    {newsletter.thumbnail_url && (
                      <img
                        src={newsletter.thumbnail_url}
                        alt="Newsletter"
                        className="h-24 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground line-clamp-3">{newsletter.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex gap-4">
                      {newsletter.author_name && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {newsletter.author_name}
                        </span>
                      )}
                      {newsletter.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(newsletter.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {newsletter.view_count || 0} views
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Read Full Story
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Newsletters */}
      {regularNewsletters.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Recent Updates</h3>
          <div className="grid gap-3">
            {regularNewsletters.map(newsletter => (
              <Card key={newsletter.id} className="hover:bg-card/80 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{newsletter.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{newsletter.content}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
                        {newsletter.category && (
                          <Badge variant="outline" className="capitalize text-xs">{newsletter.category}</Badge>
                        )}
                        {newsletter.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(newsletter.published_at).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {newsletter.view_count || 0}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredNewsletters.length === 0 && !loading && (
        <Card className="bg-muted/50">
          <CardContent className="pt-8 text-center">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-foreground mb-1">No Updates Yet</h3>
            <p className="text-sm text-muted-foreground">
              Check back soon for updates in this category.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Featured Citizens Section */}
      {featured.length > 0 && (
        <div className="space-y-6 border-t border-border pt-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-foreground">Responsible Citizens Making Impact</h2>
            </div>
            <p className="text-muted-foreground">
              These civic leaders demonstrate exceptional commitment to community improvement. Their persistent reporting and advocacy have led to real government action and measurable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(citizen => (
              <Card key={citizen.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 w-full bg-gradient-to-b from-primary/20 to-background">
                  {citizen.image_url && (
                    <Image
                      src={citizen.image_url}
                      alt={citizen.citizen_name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3 bg-yellow-500 rounded-full px-3 py-1 text-xs font-bold text-white">
                    {citizen.points_awarded} Points
                  </div>
                </div>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{citizen.citizen_name}</h3>
                    <p className="text-sm text-muted-foreground">Profile ID: {citizen.profile_id}</p>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-sm font-semibold text-foreground mb-1">Key Achievement</p>
                    <p className="text-xs text-foreground">{citizen.reason_featured}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-semibold text-foreground">{citizen.locality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issues Reported:</span>
                      <span className="font-semibold text-foreground">{citizen.issues_reported}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolved:</span>
                      <span className="font-semibold text-green-600">{citizen.issues_resolved}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2 text-center">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-200">
                      Resolution Rate: {Math.round((citizen.issues_resolved / citizen.issues_reported) * 100)}%
                    </p>
                  </div>

                  <Button variant="default" className="w-full" size="sm">
                    <Heart className="h-3 w-3 mr-2" />
                    Vote for Elections
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Impact Stories Section */}
      {sections.length > 0 && (
        <div className="space-y-4 border-t border-border pt-8">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Community Impact Stories
          </h2>
          <div className="grid gap-4">
            {sections.map(section => (
              <Card key={section.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1 relative h-48 md:h-full bg-muted">
                    {section.image && (
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="md:col-span-3 pt-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">{section.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(section.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-foreground">{section.title}</h3>
                    </div>
                    <p className="text-sm text-foreground">{section.description}</p>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-200">{section.impact}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
