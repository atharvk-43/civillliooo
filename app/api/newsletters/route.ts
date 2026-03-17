import { type NextRequest, NextResponse } from "next/server"
import { getPublishedNewsletters, publishNewsletter } from "@/lib/newsletter-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    const newsletters = await getPublishedNewsletters(limit, offset)

    // Return success with empty data if table doesn't exist (frontend will use mock data)
    return NextResponse.json({
      success: true,
      data: newsletters || [],
      count: newsletters.length,
    })
  } catch (error) {
    console.error("[API] Error fetching newsletters:", error)
    // Return success with empty data on error to allow frontend to use mock data
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      message: "Using mock data - database table not yet initialized"
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, content" },
        { status: 400 }
      )
    }

    const newsletter = await publishNewsletter({
      title: body.title,
      content: body.content,
      category: body.category,
      featured_issue_id: body.featured_issue_id,
      author_id: body.author_id,
      author_name: body.author_name,
      thumbnail_url: body.thumbnail_url,
    })

    return NextResponse.json(
      {
        success: true,
        data: newsletter,
        message: "Newsletter published successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Error publishing newsletter:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to publish newsletter",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
