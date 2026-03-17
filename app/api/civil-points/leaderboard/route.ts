import { type NextRequest, NextResponse } from "next/server"
import { getCivilPointsLeaderboard } from "@/lib/newsletter-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locality = searchParams.get("locality")
    const limit = parseInt(searchParams.get("limit") || "50")

    const leaderboard = await getCivilPointsLeaderboard(locality || undefined, limit)

    return NextResponse.json({
      success: true,
      data: leaderboard,
      count: leaderboard.length,
    })
  } catch (error) {
    console.error("[API] Error fetching leaderboard:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leaderboard",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
