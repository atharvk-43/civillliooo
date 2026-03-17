'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, MessageCircle, Share2, MapPin, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Image from 'next/image'

interface FeedPost {
  id: string
  author: {
    name: string
    avatarUrl?: string
    civicPoints: number
    neighborhood: string
  }
  type: 'problem_report' | 'solution' | 'positive_action'
  title: string
  description: string
  category: string
  location: string
  images?: string[]
  status: 'active' | 'in_progress' | 'resolved'
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  timestamp: string
  coordinates?: { lat: number; lng: number }
}

export function CivicSocialFeed() {
  const mockPosts: FeedPost[] = [
    {
      id: '1',
      author: {
        name: 'Priya Sharma',
        civicPoints: 850,
        neighborhood: 'Vijay Nagar'
      },
      type: 'problem_report',
      title: 'Massive Pothole on Main Street - Safety Hazard',
      description: 'This pothole has been growing for weeks and is now a serious safety hazard for both vehicles and pedestrians. I documented the damage with photos. It\'s spreading and needs urgent attention before someone gets hurt.',
      category: 'Road Infrastructure',
      location: 'Main Street, Vijay Nagar',
      images: ['/images/pothole-1.jpg', '/images/pothole-2.jpg'],
      status: 'in_progress',
      engagement: { likes: 234, comments: 45, shares: 89 },
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      author: {
        name: 'Municipal Corporation',
        civicPoints: 500,
        neighborhood: 'City Administration'
      },
      type: 'positive_action',
      title: 'Water Supply Restored to East Indore - 48 Hour Emergency Response',
      description: 'Our team responded to the water crisis within 48 hours, restoring supply to 2,340 families. This was possible because of detailed reports from citizens. Thank you for your collaboration!',
      category: 'Water Supply',
      location: 'East Indore District',
      images: ['/images/water-supply.jpg'],
      status: 'resolved',
      engagement: { likes: 5200, comments: 320, shares: 1200 },
      timestamp: '1 day ago'
    },
    {
      id: '3',
      author: {
        name: 'Rajesh Kumar',
        civicPoints: 720,
        neighborhood: 'Palasia'
      },
      type: 'solution',
      title: 'Community Waste Segregation Program - Weekly Results',
      description: 'Started a community initiative to segregate waste properly. In just 3 weeks, we\'ve collected 8 tons of recyclable material that will be sent to processing centers. This reduces landfill pressure significantly.',
      category: 'Waste Management',
      location: 'Palasia Ward - All Streets',
      images: ['/images/waste-segregation.jpg'],
      status: 'active',
      engagement: { likes: 1240, comments: 156, shares: 340 },
      timestamp: '3 days ago'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'problem_report':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'solution':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'positive_action':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Feed Filters */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card border border-border w-full justify-start">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {mockPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Post Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatarUrl} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">{post.author.name}</p>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-semibold">
                          {post.author.civicPoints} pts
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{post.author.neighborhood} • {post.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={getTypeColor(post.type)}>
                    {post.type === 'problem_report' && 'Issue Report'}
                    {post.type === 'solution' && 'Solution'}
                    {post.type === 'positive_action' && 'Achievement'}
                  </Badge>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm">{post.description}</p>
                </div>

                {/* Category and Location */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">{post.category}</Badge>
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {post.location}
                  </Badge>
                  {post.status && (
                    <div className="flex items-center gap-1 text-xs">
                      {getStatusIcon(post.status)}
                      <span className="capitalize font-medium">
                        {post.status === 'in_progress' ? 'In Progress' : post.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Images Grid */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.map((image, idx) => (
                      <div key={idx} className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center border border-border">
                        <span className="text-sm text-muted-foreground">Image {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="px-4 py-2 bg-muted/50 border-t border-border flex gap-6 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Heart className="h-4 w-4" />
                  {post.engagement.likes.toLocaleString()}
                </button>
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  {post.engagement.comments.toLocaleString()}
                </button>
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Share2 className="h-4 w-4" />
                  {post.engagement.shares.toLocaleString()}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t border-border flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 gap-2">
                  <Heart className="h-4 w-4" />
                  Support
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Other tabs */}
        <TabsContent value="problems" className="mt-6 text-center text-muted-foreground">
          <p>Problem reports will be filtered here</p>
        </TabsContent>
        <TabsContent value="solutions" className="mt-6 text-center text-muted-foreground">
          <p>Solution ideas will be filtered here</p>
        </TabsContent>
        <TabsContent value="achievements" className="mt-6 text-center text-muted-foreground">
          <p>Government achievements will be shown here</p>
        </TabsContent>
        <TabsContent value="nearby" className="mt-6 text-center text-muted-foreground">
          <p>Issues near your location will appear here</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
