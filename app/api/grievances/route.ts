import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !serviceKey) {
        throw new Error('Missing Supabase environment variables')
    }
    return createClient(url, serviceKey)
}

function generateTrackingId(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 900000) + 100000
    return `CIV-${year}-${random}`
}

// GET /api/grievances — fetch all with filters
export async function GET(request: NextRequest) {
    try {
        const supabase = getAdminClient()
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const category = searchParams.get('category')
        const priority = searchParams.get('priority')
        const limit = parseInt(searchParams.get('limit') ?? '50')
        const offset = parseInt(searchParams.get('offset') ?? '0')

        let query = supabase
            .from('grievances')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (status) query = query.eq('status', status)
        if (category) query = query.eq('category', category)
        if (priority) query = query.eq('priority', priority)

        const { data, error, count } = await query

        if (error) throw error

        return NextResponse.json({ data, count, success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
}

// POST /api/grievances — create new grievance
export async function POST(request: NextRequest) {
    try {
        const supabase = getAdminClient()
        const body = await request.json()

        // Support both the form field names AND the direct API field names
        const complainant_name = body.complainant_name || body.citizenName || body.name
        const complainant_email = body.complainant_email || body.email
        const complainant_phone = body.complainant_phone || body.phone
        const location = body.zone
            ? `${body.location}, ${body.zone}`
            : (body.location || '')
        const rawCategory = body.category || body.issueType || ''
        const title = body.title || rawCategory
        const description = body.description || ''
        const priority = body.priority || 'medium'
        const ward = body.ward || body.zone || null
        const pincode = body.pincode || null

        // Map display category names to DB enum values
        const categoryMap: Record<string, string> = {
            'road & infrastructure': 'roads', 'road': 'roads', 'roads': 'roads',
            'water supply': 'water', 'water': 'water',
            'street lighting': 'electricity', 'utilities': 'electricity', 'electricity': 'electricity',
            'waste management': 'sanitation', 'sanitation': 'sanitation',
            'traffic & parking': 'public_safety', 'public health': 'public_safety', 'public_safety': 'public_safety',
            'noise pollution': 'noise', 'noise': 'noise',
            'building permit': 'permits', 'permits': 'permits',
            'parks': 'parks',
        }
        const category = categoryMap[rawCategory.toLowerCase()] || 'other'

        // Validation
        if (!title || !description || !location || !complainant_name) {
            return NextResponse.json(
                { error: 'Missing required fields: title/category, description, location, name', success: false },
                { status: 400 }
            )
        }

        const newGrievance = {
            title,
            description,
            category,
            status: 'pending',
            priority,
            location,
            ward,
            pincode,
            complainant_name,
            complainant_email: complainant_email || null,
            complainant_phone: complainant_phone || null,
            tracking_id: generateTrackingId(),
        }

        const { data, error } = await supabase
            .from('grievances')
            .insert([newGrievance])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data, success: true }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
}

// PATCH /api/grievances — update grievance status
export async function PATCH(request: NextRequest) {
    try {
        const supabase = getAdminClient()
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'Missing grievance id', success: false }, { status: 400 })
        }

        // Auto-set resolved_at timestamp
        if (updates.status === 'resolved' && !updates.resolved_at) {
            updates.resolved_at = new Date().toISOString()
        }

        const { data, error } = await supabase
            .from('grievances')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data, success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
}
