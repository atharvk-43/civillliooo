import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !serviceKey) throw new Error('Missing Supabase environment variables')
    return createClient(url, serviceKey)
}

// GET /api/dashboard/stats — real-time aggregated metrics
export async function GET(request: NextRequest) {
    try {
        const supabase = getAdminClient()

        // Run all queries in parallel
        const [
            grievancesResult,
            workOrdersResult,
            recentGrievancesResult,
            categoryBreakdownResult
        ] = await Promise.all([
            // Grievance counts by status
            supabase.from('grievances').select('status', { count: 'exact' }),

            // Work order counts
            supabase.from('work_orders').select('status', { count: 'exact' }),

            // Most recent 5 grievances
            supabase.from('grievances')
                .select('id, title, status, priority, category, created_at, complainant_name, tracking_id')
                .order('created_at', { ascending: false })
                .limit(5),

            // Category breakdown
            supabase.from('grievances').select('category')
        ])

        const grievances = grievancesResult.data ?? []
        const workOrders = workOrdersResult.data ?? []

        // Compute stats
        const total_grievances = grievancesResult.count ?? 0
        const pending = grievances.filter(g => g.status === 'pending').length
        const in_progress = grievances.filter(g => g.status === 'in_progress').length
        const resolved = grievances.filter(g => g.status === 'resolved').length
        const rejected = grievances.filter(g => g.status === 'rejected').length

        const total_work_orders = workOrdersResult.count ?? 0
        const open_wo = workOrders.filter(w => w.status === 'open').length
        const completed_wo = workOrders.filter(w => w.status === 'completed').length

        // Category counts
        const categories = categoryBreakdownResult.data ?? []
        const categoryMap: Record<string, number> = {}
        categories.forEach((g: any) => {
            categoryMap[g.category] = (categoryMap[g.category] || 0) + 1
        })

        return NextResponse.json({
            success: true,
            data: {
                grievances: {
                    total: total_grievances,
                    pending,
                    in_progress,
                    resolved,
                    rejected,
                    resolution_rate: total_grievances > 0 ? Math.round((resolved / total_grievances) * 100) : 0
                },
                work_orders: {
                    total: total_work_orders,
                    open: open_wo,
                    completed: completed_wo,
                    completion_rate: total_work_orders > 0 ? Math.round((completed_wo / total_work_orders) * 100) : 0
                },
                recent_grievances: recentGrievancesResult.data ?? [],
                category_breakdown: categoryMap,
                last_updated: new Date().toISOString()
            }
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
}
