"use client"

import type React from "react"
import { Calendar, MapPin, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface ModuleLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  onRefresh?: () => void
  timeRange?: {
    selected: string
    options: string[]
    onSelect?: (value: string) => void
  }
  region?: {
    selected: string
    options: string[]
    onSelect?: (value: string) => void
  }
}

export function ModuleLayout({ children, title, description, onRefresh, timeRange, region }: ModuleLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {timeRange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  {timeRange.selected}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {timeRange.options.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => timeRange.onSelect?.(option)}
                    className={timeRange.selected === option ? "bg-accent/20" : ""}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {region && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <MapPin className="h-4 w-4" />
                  {region.selected}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {region.options.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => region.onSelect?.(option)}
                    className={region.selected === option ? "bg-accent/20" : ""}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
