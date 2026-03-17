// Database utility for server-side queries
// Replace with your actual database connection

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// For SQL databases (Neon, PostgreSQL)
export async function query(sql: string, params?: any[]) {
  try {
    const response = await fetch(new URL("/api/query", process.env.VERCEL_URL || "http://localhost:3000"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }),
    })

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("[DB] Query error:", error)
    throw error
  }
}

// For mock/demo mode (data returned from component state)
export const mockGrievances = [
  {
    id: 1,
    tracking_id: "GR-2024-001847",
    citizen_name: "Rajesh Kumar",
    status: "In Review",
    issue_type: "Pothole Damage",
    location_description: "Main Street, Downtown Zone",
  },
]
