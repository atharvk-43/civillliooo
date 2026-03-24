import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser/client-side client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type GrievanceStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'
export type GrievancePriority = 'low' | 'medium' | 'high' | 'critical'
export type GrievanceCategory = 'roads' | 'water' | 'electricity' | 'sanitation' | 'public_safety' | 'parks' | 'permits' | 'noise' | 'other'

export interface Grievance {
    id: string
    created_at: string
    updated_at: string
    title: string
    description: string
    category: GrievanceCategory
    status: GrievanceStatus
    priority: GrievancePriority
    location: string
    ward?: string
    pincode?: string
    complainant_name: string
    complainant_email?: string
    complainant_phone?: string
    assigned_to?: string
    resolution_notes?: string
    resolved_at?: string
    tracking_id: string
}

export interface WorkOrder {
    id: string
    created_at: string
    updated_at: string
    title: string
    description: string
    status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
    priority: 'low' | 'medium' | 'high'
    category: string
    assigned_to?: string
    due_date?: string
    completed_at?: string
    grievance_id?: string
    budget_allocated?: number
    budget_spent?: number
}

export interface DashboardStats {
    total_grievances: number
    pending_grievances: number
    in_progress_grievances: number
    resolved_grievances: number
    total_work_orders: number
    open_work_orders: number
    completed_work_orders: number
    resolution_rate: number
}
