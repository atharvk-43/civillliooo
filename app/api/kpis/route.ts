import { NextResponse } from "next/server"

// Mock KPI data - Replace with real database queries in production
const mockKPIs = {
  "city-management": [
    { name: "Active Projects", value: 67, unit: "", trend: 12, direction: "up" },
    { name: "Total Budget", value: 2.8, unit: "M", trend: 8, direction: "up" },
    { name: "Avg Completion", value: 76, unit: "%", trend: 5, direction: "up" },
  ],
  "traffic-mobility": [
    { name: "Vehicles Tracked", value: 28340, unit: "", trend: 8, direction: "up" },
    { name: "Avg Congestion", value: 58, unit: "%", trend: 12, direction: "up" },
    { name: "Avg Speed", value: 24, unit: "km/h", trend: 15, direction: "down" },
  ],
  "energy-utilities": [
    { name: "Power Consumption", value: 8340, unit: "MWh", trend: 14, direction: "up" },
    { name: "Grid Efficiency", value: 94.2, unit: "%", trend: 2, direction: "up" },
  ],
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const module = url.searchParams.get("module")

    if (!module || !mockKPIs[module as keyof typeof mockKPIs]) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: mockKPIs[module as keyof typeof mockKPIs],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch KPIs" }, { status: 500 })
  }
}
