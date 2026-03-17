import { type NextRequest, NextResponse } from "next/server"
import { getLocalityCivilPoints } from "@/lib/newsletter-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mlaId = searchParams.get("mlaId")

    const localityData = await getLocalityCivilPoints(mlaId || undefined)

    return NextResponse.json({
      success: true,
      data: localityData,
      count: localityData.length,
    })
  } catch (error) {
    console.error("[API] Error fetching locality data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch locality data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
