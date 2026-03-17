'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share2, Award, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface NewspaperStory {
  id: string
  title: string
  content: string
  featuredImageUrl?: string
  storyType: 'featured_citizen' | 'government_action' | 'community_impact'
  citizenProfile?: {
    id: string
    name: string
    avatarUrl?: string
    civicPoints: number
    neighborhood: string
    civicValues: string
  }
  governmentAction?: {
    title: string
    department: string
    impact: string
    beforeImage?: string
    afterImage?: string
  }
  publishedDate: string
  engagement: {
    views: number
    shares: number
  }
}

export function SmartCityNewspaper({ stories = [] }: { stories?: NewspaperStory[] }) {
  const mockStories: NewspaperStory[] = stories.length > 0 ? stories : [
    {
      id: '1',
      title: 'Meet Priya Sharma: The Pothole Fighter of Vijay Nagar',
      storyType: 'featured_citizen',
      content: 'Priya Sharma has filed 12 detailed grievances about potholes in Vijay Nagar and personally monitored 8 repairs. Her dedication to public safety earned her 450 Civic Points and recognition as a "Civil Society Champion".',
      featuredImageUrl: '/images/featured-citizen-1.jpg',
      citizenProfile: {
        id: 'user_1',
        name: 'Priya Sharma',
        avatarUrl: '/avatars/priya.jpg',
        civicPoints: 450,
        neighborhood: 'Vijay Nagar, Indore',
        civicValues: 'Civic Dedication, Public Safety Leadership'
      },
      publishedDate: '2024-03-08',
      engagement: { views: 1240, shares: 89 }
    },
    {
      id: '2',
      title: 'Government Completes Water Supply Project 3 Weeks Ahead of Schedule',
      storyType: 'government_action',
      content: 'The Department of Water Supply delivered clean drinking water to 15,000 residents in East Indore, completing the project on 3 weeks early. This positive action benefited 2,340 families who reported improved water quality.',
      featuredImageUrl: '/images/water-project.jpg',
      governmentAction: {
        title: 'Water Supply Infrastructure Upgrade',
        department: 'Department of Water Supply',
        impact: 'Served 15,000 residents across 2,340 families'
      },
      publishedDate: '2024-03-07',
      engagement: { views: 5200, shares: 340 }
    },
    {
      id: '3',
      title: 'Community-Led Street Cleaning Initiative Transforms Nalakhara',
      storyType: 'community_impact',
      content: '42 citizens united to clean 8 kilometers of streets in Nalakhara Ward. Their collective action not only cleaned the neighborhood but also influenced city officials to increase waste collection frequency.',
      featuredImageUrl: '/images/community-cleanup.jpg',
      publishedDate: '2024-03-06',
      engagement: { views: 3100, shares: 250 }
    }
  ]

  return (
    <div className="space-y-8">
      {/* Newspaper Header */}
      <div className="border-b-4 border-primary pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Civilio Times</h1>
            <p className="text-sm text-muted-foreground">Stories of Change, Citizen Leadership & Civic Excellence</p>
          </div>
        </div>
      </div>

      {/* Featured Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockStories.map((story, index) => (
          <div key={story.id} className={index === 0 ? 'lg:col-span-2' : ''}>
            <Card className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full flex flex-col ${
              index === 0 ? 'border-2 border-primary' : 'border-border'
            }`}>
              {/* Story Image */}
              {story.featuredImageUrl && (
                <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center text-sm text-muted-foreground">Featured Image</div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Story Type Badge */}
                <div className="mb-3">
                  {story.storyType === 'featured_citizen' && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Featured Citizen</Badge>
                  )}
                  {story.storyType === 'government_action' && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Positive Action</Badge>
                  )}
                  {story.storyType === 'community_impact' && (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Community Impact</Badge>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-3 line-clamp-3">{story.title}</h2>

                {/* Content */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">{story.content}</p>

                {/* Featured Citizen Profile */}
                {story.citizenProfile && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={story.citizenProfile.avatarUrl} />
                        <AvatarFallback>{story.citizenProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{story.citizenProfile.name}</p>
                        <p className="text-xs text-muted-foreground">{story.citizenProfile.neighborhood}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                        <Award className="h-3 w-3" />
                        {story.citizenProfile.civicPoints}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Civic Values: {story.citizenProfile.civicValues}
                    </p>
                  </div>
                )}

                {/* Government Action Details */}
                {story.governmentAction && (
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-900">
                    <p className="font-semibold text-foreground text-sm mb-2">{story.governmentAction.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      <strong>Department:</strong> {story.governmentAction.department}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                      <strong>Impact:</strong> {story.governmentAction.impact}
                    </p>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                  <div className="flex gap-4">
                    <span>{story.engagement.views.toLocaleString()} views</span>
                    <span>{story.engagement.shares.toLocaleString()} shares</span>
                  </div>
                  <span>{story.publishedDate}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" size="sm" className="flex-1 gap-2">
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline">Inspired</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* View All Stories Link */}
      <div className="text-center">
        <Link href="/newspaper/all-stories">
          <Button size="lg" variant="outline">
            Read More Stories
          </Button>
        </Link>
      </div>
    </div>
  )
}
