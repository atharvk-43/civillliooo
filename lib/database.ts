import { Pool, QueryResult } from '@neondatabase/serverless';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Grievance Operations
export async function createGrievance(grievanceData: {
  citizenName: string;
  email: string;
  phone: string;
  category: string;
  title?: string;
  description: string;
  location: string;
  priority?: string;
  attachments?: string[];
}) {
  const client = await pool.connect();
  try {
    // Generate tracking ID
    const trackingId = `GR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
    
    const result = await client.query(
      `INSERT INTO grievances (
        tracking_id, citizen_name, citizen_email, citizen_phone, issue_type,
        description, location_description, zone, priority, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING id, tracking_id, citizen_name, citizen_email, status, created_at`,
      [
        trackingId,
        grievanceData.citizenName,
        grievanceData.email,
        grievanceData.phone,
        grievanceData.category,
        grievanceData.description,
        grievanceData.location,
        grievanceData.location, // Using location as zone placeholder
        grievanceData.priority || 'Medium',
        'Submitted',
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getGrievanceById(id: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM grievances WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function updateGrievanceStatus(
  id: string,
  status: string,
  notes?: string
) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE grievances 
       SET status = $1, updated_at = NOW(), resolution_notes = $2
       WHERE id = $3
       RETURNING id, status, updated_at`,
      [status, notes, id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getAllGrievances(limit = 50, offset = 0) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM grievances 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getGrievancesByEmail(email: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM grievances WHERE citizen_email = $1 ORDER BY created_at DESC`,
      [email]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Work Order Operations
export async function createWorkOrder(workOrderData: {
  title: string;
  description: string;
  priority: string;
  location: string;
  estimatedHours: number;
  estimatedCost: number;
  vendorId: string;
  grievanceId?: string;
  assignedBy: string;
}) {
  const client = await pool.connect();
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7-day deadline

    const result = await client.query(
      `INSERT INTO work_orders (
        title, description, priority, location, estimated_hours, 
        estimated_cost, vendor_id, grievance_id, assigned_by, 
        status, due_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING id, title, status, due_date, created_at`,
      [
        workOrderData.title,
        workOrderData.description,
        workOrderData.priority,
        workOrderData.location,
        workOrderData.estimatedHours,
        workOrderData.estimatedCost,
        workOrderData.vendorId,
        workOrderData.grievanceId || null,
        workOrderData.assignedBy,
        'assigned',
        dueDate,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateWorkOrderStatus(
  id: string,
  status: string,
  completionNotes?: string,
  actualCost?: number
) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE work_orders 
       SET status = $1, updated_at = NOW(), 
           completion_notes = $2, actual_cost = $3
       WHERE id = $4
       RETURNING id, status, updated_at, completion_notes`,
      [status, completionNotes, actualCost, id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getWorkOrdersByVendor(vendorId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM work_orders 
       WHERE vendor_id = $1 
       ORDER BY created_at DESC`,
      [vendorId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getWorkOrdersOverdue() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM work_orders 
       WHERE status NOT IN ('completed', 'cancelled') 
       AND due_date < NOW()
       ORDER BY due_date ASC`
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Feedback Operations
export async function createFeedback(feedbackData: {
  grievanceId: string;
  rating: number;
  comment: string;
  citizenEmail: string;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO audit_logs (
        grievance_id, action, actor, details, created_at
      ) VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, created_at`,
      [
        feedbackData.grievanceId,
        'citizen_feedback',
        feedbackData.citizenEmail,
        JSON.stringify({
          rating: feedbackData.rating,
          comment: feedbackData.comment,
        }),
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function createAuditLog(auditData: {
  grievanceId?: string;
  workOrderId?: string;
  action: string;
  actor: string;
  details: string;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO audit_logs (
        grievance_id, work_order_id, action, actor, details, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, created_at`,
      [
        auditData.grievanceId || null,
        auditData.workOrderId || null,
        auditData.action,
        auditData.actor,
        auditData.details,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getAuditTrail(grievanceId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM audit_logs 
       WHERE grievance_id = $1 
       ORDER BY created_at DESC`,
      [grievanceId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}
