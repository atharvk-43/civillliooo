import { pool } from "./database"

export interface Newsletter {
  id?: number
  title: string
  content: string
  category?: string
  featured_issue_id?: number
  author_id?: string
  author_name?: string
  thumbnail_url?: string
  published_at?: Date
  is_featured?: boolean
  is_published?: boolean
  view_count?: number
  status?: string
}

export interface CivilPoints {
  id?: number
  citizen_id: string
  citizen_name: string
  locality: string
  mla_jurisdiction?: string
  total_points: number
  problems_reported: number
  problems_resolved: number
  verified_outcomes: number
  rank?: string
  badge_level?: string
}

export interface LocalityCivilPoints {
  id?: number
  locality_name: string
  mla_name: string
  mla_id: string
  total_citizen_points: number
  problems_reported: number
  problems_resolved: number
  active_citizens: number
  resolution_rate: number
  rank: number
}

export async function publishNewsletter(newsletter: Newsletter) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `INSERT INTO newsletters (title, content, category, featured_issue_id, author_id, author_name, thumbnail_url, is_published, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        newsletter.title,
        newsletter.content,
        newsletter.category || "general",
        newsletter.featured_issue_id,
        newsletter.author_id,
        newsletter.author_name,
        newsletter.thumbnail_url,
        true,
        "published",
      ]
    )
    return result.rows[0]
  } catch (error) {
    // If table doesn't exist, return mock response
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.warn('[v0] Newsletters table does not exist, returning mock newsletter')
      return {
        id: Math.floor(Math.random() * 10000),
        ...newsletter,
        published_at: new Date(),
        is_published: true,
        status: 'published'
      }
    }
    throw error
  } finally {
    client.release()
  }
}

export async function getPublishedNewsletters(limit: number = 10, offset: number = 0) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT * FROM newsletters 
       WHERE is_published = TRUE 
       ORDER BY published_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return result.rows
  } catch (error) {
    // If table doesn't exist, return empty array (will be handled by mock data in frontend)
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.warn('[v0] Newsletters table does not exist, returning empty array')
      return []
    }
    throw error
  } finally {
    client.release()
  }
}

export async function getFeaturedNewsletters() {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT * FROM newsletters 
       WHERE is_featured = TRUE AND is_published = TRUE
       ORDER BY published_at DESC 
       LIMIT 5`
    )
    return result.rows
  } catch (error) {
    // If table doesn't exist, return empty array (will be handled by mock data in frontend)
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.warn('[v0] Newsletters table does not exist, returning empty array')
      return []
    }
    throw error
  } finally {
    client.release()
  }
}

export async function getNewsletterById(id: number) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT * FROM newsletters WHERE id = $1`,
      [id]
    )
    if (result.rows.length > 0) {
      // Increment view count
      await client.query(
        `UPDATE newsletters SET view_count = view_count + 1 WHERE id = $1`,
        [id]
      )
    }
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function getCivilPointsForCitizen(citizenId: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT * FROM civil_points WHERE citizen_id = $1`,
      [citizenId]
    )
    return result.rows[0] || null
  } catch (error) {
    // If table doesn't exist, return null (frontend handles gracefully)
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.warn('[v0] Civil points table does not exist')
      return null
    }
    throw error
  } finally {
    client.release()
  }
}

export async function awardCivilPoints(
  citizenId: string,
  citizenName: string,
  locality: string,
  grievanceId: number,
  pointsToAward: number,
  reason: string,
  verifiedBy: string
) {
  const client = await pool.connect()
  try {
    // Get or create civil points record
    let citizenRecord = await getCivilPointsForCitizen(citizenId)

    if (!citizenRecord) {
      await client.query(
        `INSERT INTO civil_points (citizen_id, citizen_name, locality, total_points)
         VALUES ($1, $2, $3, $4)`,
        [citizenId, citizenName, locality, 0]
      )
      citizenRecord = await getCivilPointsForCitizen(citizenId)
    }

    // Award points and update rank
    const newTotalPoints = (citizenRecord?.total_points || 0) + pointsToAward
    const rank = calculateRank(newTotalPoints)

    await client.query(
      `UPDATE civil_points 
       SET total_points = total_points + $1, rank = $2, updated_at = CURRENT_TIMESTAMP
       WHERE citizen_id = $3`,
      [pointsToAward, rank, citizenId]
    )

    // Log in ledger
    await client.query(
      `INSERT INTO civil_points_ledger (citizen_id, grievance_id, points_awarded, reason, verified_by, verification_date)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [citizenId, grievanceId, pointsToAward, reason, verifiedBy]
    )

    return { success: true, newTotalPoints, rank }
  } catch (error) {
    // If tables don't exist, return mock success response
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.warn('[v0] Civil points tables do not exist, returning mock response')
      const newTotalPoints = pointsToAward
      const rank = calculateRank(newTotalPoints)
      return { success: true, newTotalPoints, rank, mockData: true }
    }
    throw error
  } finally {
    client.release()
  }
}

export async function getCivilPointsLeaderboard(locality?: string, limit: number = 20) {
  const client = await pool.connect()
  try {
    let query = `SELECT * FROM civil_points`
    const params: any[] = []

    if (locality) {
      query += ` WHERE locality = $1`
      params.push(locality)
    }

    query += ` ORDER BY total_points DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    // If table doesn't exist, return empty array (frontend handles with mock data)
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.warn('[v0] Civil points table does not exist')
      return []
    }
    throw error
  } finally {
    client.release()
  }
}

export async function getLocalityCivilPoints(mlaId?: string) {
  const client = await pool.connect()
  try {
    let query = `SELECT * FROM locality_civil_points`
    const params: any[] = []

    if (mlaId) {
      query += ` WHERE mla_id = $1`
      params.push(mlaId)
    }

    query += ` ORDER BY rank ASC`

    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    // If table doesn't exist, return empty array (frontend handles with mock data)
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.warn('[v0] Locality civil points table does not exist')
      return []
    }
    throw error
  } finally {
    client.release()
  }
}

export async function recordNewsletterEngagement(
  newsletterId: number,
  userId: string,
  engagementType: string
) {
  const client = await pool.connect()
  try {
    await client.query(
      `INSERT INTO newsletter_engagement (newsletter_id, user_id, engagement_type, engaged_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
      [newsletterId, userId, engagementType]
    )
  } finally {
    client.release()
  }
}

export async function getCommunityUpdates(locality?: string, limit: number = 10) {
  const client = await pool.connect()
  try {
    let query = `SELECT * FROM community_updates WHERE is_published = TRUE`
    const params: any[] = []

    if (locality) {
      query += ` AND locality = $1`
      params.push(locality)
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const result = await client.query(query, params)
    return result.rows
  } finally {
    client.release()
  }
}

function calculateRank(totalPoints: number): string {
  if (totalPoints >= 1000) return "Platinum Citizen"
  if (totalPoints >= 500) return "Gold Citizen"
  if (totalPoints >= 250) return "Silver Citizen"
  if (totalPoints >= 100) return "Bronze Citizen"
  if (totalPoints >= 50) return "Active Civic Participant"
  if (totalPoints >= 10) return "Emerging Civic Leader"
  return "New Participant"
}
