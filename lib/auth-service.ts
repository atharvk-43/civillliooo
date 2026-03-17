import { pool } from './database'
import crypto from 'crypto'

export interface CitizenAuthRequest {
  fullName: string
  email: string
  identificationType: 'aadhar' | 'pan' | 'epic'
  identificationNumber: string
  locality?: string
  phoneNumber?: string
}

export interface LeaderAuthRequest {
  fullName: string
  email: string
  adminPosition: 'chief_minister' | 'district_magistrate' | 'deputy_district_magistrate' | 'mayor' | 'municipal_commissioner' | 'department_head'
  appointmentLetterNumber: string
  appointmentDate: string
  jurisdictionId?: number
  departmentId?: number
  phoneNumber?: string
}

export interface WorkerAuthRequest {
  fullName: string
  email: string
  workerType: 'vendor' | 'contractor' | 'department_staff' | 'field_worker'
  appointmentId: string
  municipality: string
  department: string
  designation: string
  appointmentDocumentPath: string
  supervisorName?: string
  supervisorEmail?: string
  phoneNumber?: string
}

// Hash sensitive data
function hashSensitiveData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Citizen Authentication
export async function registerCitizen(request: CitizenAuthRequest) {
  const client = await pool.connect()
  try {
    const userId = `CITIZEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const identificationHash = hashSensitiveData(request.identificationNumber)

    // Check if citizen already registered with this identification
    const existingCheck = await client.query(
      'SELECT id FROM citizen_verification WHERE identification_hash = $1',
      [identificationHash]
    )

    if (existingCheck.rows.length > 0) {
      return {
        success: false,
        message: 'This identification number is already registered',
        error: 'DUPLICATE_IDENTIFICATION'
      }
    }

    // Register new citizen
    const result = await client.query(
      `INSERT INTO citizen_verification (
        user_id, full_name, email, identification_type, 
        identification_number, identification_hash, locality, 
        phone_number, verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, user_id, full_name, email, verification_status`,
      [
        userId,
        request.fullName,
        request.email,
        request.identificationType,
        request.identificationNumber,
        identificationHash,
        request.locality || null,
        request.phoneNumber || null,
        'pending'
      ]
    )

    // Log audit event
    await logAuthEvent('citizen_registration', userId, 'citizen', 'pending', request.email)

    return {
      success: true,
      message: 'Registration successful. Your identity will be verified within 24 hours.',
      data: result.rows[0]
    }
  } catch (error) {
    console.error('[AUTH] Citizen registration error:', error)
    return {
      success: false,
      message: 'Registration failed',
      error: 'DATABASE_ERROR'
    }
  } finally {
    client.release()
  }
}

export async function verifyCitizenLogin(email: string, identificationNumber: string) {
  const client = await pool.connect()
  try {
    const identificationHash = hashSensitiveData(identificationNumber)

    const result = await client.query(
      `SELECT id, user_id, full_name, email, verification_status, is_verified, locality
       FROM citizen_verification 
       WHERE email = $1 AND identification_hash = $2`,
      [email, identificationHash]
    )

    if (result.rows.length === 0) {
      await logAuthEvent('citizen_login_failed', '', 'citizen', 'failed', email)
      return {
        success: false,
        message: 'Invalid email or identification number',
        error: 'INVALID_CREDENTIALS'
      }
    }

    const citizen = result.rows[0]

    if (!citizen.is_verified) {
      return {
        success: false,
        message: `Your identity is still being verified. Status: ${citizen.verification_status}`,
        error: 'NOT_VERIFIED'
      }
    }

    // Update last login
    await client.query(
      'UPDATE citizen_verification SET last_login = NOW() WHERE user_id = $1',
      [citizen.user_id]
    )

    // Create session
    const session = await createAuthSession(citizen.user_id, 'citizen')

    await logAuthEvent('citizen_login_success', citizen.user_id, 'citizen', 'success', email)

    return {
      success: true,
      message: 'Login successful',
      data: {
        userId: citizen.user_id,
        fullName: citizen.full_name,
        email: citizen.email,
        locality: citizen.locality,
        sessionToken: session.sessionToken,
        userType: 'citizen'
      }
    }
  } catch (error) {
    console.error('[AUTH] Citizen login error:', error)
    return {
      success: false,
      message: 'Login failed',
      error: 'DATABASE_ERROR'
    }
  } finally {
    client.release()
  }
}

// Leader Authentication
export async function registerLeader(request: LeaderAuthRequest) {
  const client = await pool.connect()
  try {
    const userId = `LEADER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Check if leader already registered
    const existingCheck = await client.query(
      'SELECT id FROM leader_verification WHERE email = $1',
      [request.email]
    )

    if (existingCheck.rows.length > 0) {
      return {
        success: false,
        message: 'A leader account with this email already exists',
        error: 'DUPLICATE_EMAIL'
      }
    }

    const result = await client.query(
      `INSERT INTO leader_verification (
        user_id, full_name, email, admin_position, 
        appointment_letter_number, appointment_date, 
        jurisdiction_id, department_id, phone_number, 
        verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, user_id, full_name, email, admin_position, verification_status`,
      [
        userId,
        request.fullName,
        request.email,
        request.adminPosition,
        request.appointmentLetterNumber,
        request.appointmentDate,
        request.jurisdictionId || null,
        request.departmentId || null,
        request.phoneNumber || null,
        'manual_review'
      ]
    )

    await logAuthEvent('leader_registration', userId, 'leader', 'manual_review', request.email)

    return {
      success: true,
      message: 'Registration submitted. Administrative verification required (2-3 business days).',
      data: result.rows[0]
    }
  } catch (error) {
    console.error('[AUTH] Leader registration error:', error)
    return {
      success: false,
      message: 'Registration failed',
      error: 'DATABASE_ERROR'
    }
  } finally {
    client.release()
  }
}

export async function verifyLeaderLogin(email: string, appointmentLetterNumber: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT id, user_id, full_name, email, admin_position, 
              jurisdiction_id, verification_status, is_verified
       FROM leader_verification 
       WHERE email = $1 AND appointment_letter_number = $2`,
      [email, appointmentLetterNumber]
    )

    if (result.rows.length === 0) {
      await logAuthEvent('leader_login_failed', '', 'leader', 'failed', email)
      return {
        success: false,
        message: 'Invalid email or appointment letter number',
        error: 'INVALID_CREDENTIALS'
      }
    }

    const leader = result.rows[0]

    if (!leader.is_verified) {
      return {
        success: false,
        message: `Your credentials are being verified. Status: ${leader.verification_status}. Please contact admin.`,
        error: 'NOT_VERIFIED'
      }
    }

    // Update last login
    await client.query(
      'UPDATE leader_verification SET last_login = NOW() WHERE user_id = $1',
      [leader.user_id]
    )

    const session = await createAuthSession(leader.user_id, 'leader')

    await logAuthEvent('leader_login_success', leader.user_id, 'leader', 'success', email)

    return {
      success: true,
      message: 'Login successful',
      data: {
        userId: leader.user_id,
        fullName: leader.full_name,
        email: leader.email,
        adminPosition: leader.admin_position,
        jurisdictionId: leader.jurisdiction_id,
        sessionToken: session.sessionToken,
        userType: 'leader'
      }
    }
  } catch (error) {
    console.error('[AUTH] Leader login error:', error)
    return {
      success: false,
      message: 'Login failed',
      error: 'DATABASE_ERROR'
    }
  } finally {
    client.release()
  }
}

// Worker/Vendor Authentication
export async function registerWorker(request: WorkerAuthRequest) {
  const client = await pool.connect()
  try {
    const userId = `WORKER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const docHash = hashSensitiveData(request.appointmentDocumentPath)

    // Check if appointment ID already exists
    const existingCheck = await client.query(
      'SELECT id FROM vendor_worker_verification WHERE appointment_id = $1',
      [request.appointmentId]
    )

    if (existingCheck.rows.length > 0) {
      return {
        success: false,
        message: 'This appointment ID is already registered',
        error: 'DUPLICATE_APPOINTMENT'
      }
    }

    const result = await client.query(
      `INSERT INTO vendor_worker_verification (
        user_id, full_name, email, worker_type, 
        appointment_id, municipality_id, department, 
        designation, appointment_document_hash, 
        appointment_document_path, phone_number, 
        supervisor_name, supervisor_email, verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, user_id, full_name, email, worker_type, verification_status`,
      [
        userId,
        request.fullName,
        request.email,
        request.workerType,
        request.appointmentId,
        request.municipality,
        request.department,
        request.designation,
        docHash,
        request.appointmentDocumentPath,
        request.phoneNumber || null,
        request.supervisorName || null,
        request.supervisorEmail || null,
        'manual_review'
      ]
    )

    await logAuthEvent('worker_registration', userId, 'worker', 'manual_review', request.email)

    return {
      success: true,
      message: 'Registration submitted. Document verification required (1-2 business days).',
      data: result.rows[0]
    }
  } catch (error) {
    console.error('[AUTH] Worker registration error:', error)
    return {
      success: false,
      message: 'Registration failed',
      error: 'DATABASE_ERROR'
    }
  } finally {
    client.release()
  }
}

export async function verifyWorkerLogin(email: string, appointmentId: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT id, user_id, full_name, email, worker_type, 
              designation, department, verification_status, is_verified
       FROM vendor_worker_verification 
       WHERE email = $1 AND appointment_id = $2`,
      [email, appointmentId]
    )

    if (result.rows.length === 0) {
      await logAuthEvent('worker_login_failed', '', 'worker', 'failed', email)
      return {
        success: false,
        message: 'Invalid email or appointment ID',
        error: 'INVALID_CREDENTIALS'
      }
    }

    const worker = result.rows[0]

    if (!worker.is_verified) {
      return {
        success: false,
        message: `Your credentials are being verified. Status: ${worker.verification_status}. Please contact your supervisor.`,
        error: 'NOT_VERIFIED'
      }
    }

    // Update last login
    await client.query(
      'UPDATE vendor_worker_verification SET last_login = NOW() WHERE user_id = $1',
      [worker.user_id]
    )

    const session = await createAuthSession(worker.user_id, 'worker')

    await logAuthEvent('worker_login_success', worker.user_id, 'worker', 'success', email)

    return {
      success: true,
      message: 'Login successful',
      data: {
        userId: worker.user_id,
        fullName: worker.full_name,
        email: worker.email,
        workerType: worker.worker_type,
        designation: worker.designation,
        department: worker.department,
        sessionToken: session.sessionToken,
        userType: 'worker'
      }
    }
  } catch (error) {
    console.error('[AUTH] Worker login error:', error)
    return {
      success: false,
      message: 'Login failed',
      error: 'DATABASE_ERROR'
    }
  } finally {
    client.release()
  }
}

// Session Management
export interface AuthSession {
  sessionToken: string
  expiresAt: Date
}

export async function createAuthSession(userId: string, userType: string): Promise<AuthSession> {
  const client = await pool.connect()
  try {
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await client.query(
      `INSERT INTO auth_sessions (user_id, user_type, session_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, userType, sessionToken, expiresAt]
    )

    return { sessionToken, expiresAt }
  } finally {
    client.release()
  }
}

export async function validateSession(sessionToken: string): Promise<{ valid: boolean; userId?: string; userType?: string }> {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT user_id, user_type FROM auth_sessions 
       WHERE session_token = $1 AND is_active = true AND expires_at > NOW()`,
      [sessionToken]
    )

    if (result.rows.length === 0) {
      return { valid: false }
    }

    return { 
      valid: true, 
      userId: result.rows[0].user_id,
      userType: result.rows[0].user_type
    }
  } finally {
    client.release()
  }
}

export async function logoutSession(sessionToken: string): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(
      `UPDATE auth_sessions SET is_active = false, logout_timestamp = NOW() 
       WHERE session_token = $1`,
      [sessionToken]
    )
  } finally {
    client.release()
  }
}

// Audit Logging
export async function logAuthEvent(
  eventType: string,
  userId: string | null,
  userType: string,
  status: string,
  details: any
): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(
      `INSERT INTO auth_audit_log (event_type, user_id, user_type, status, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [eventType, userId || null, userType, status, JSON.stringify(details)]
    )
  } catch (error) {
    console.warn('[AUTH] Could not log auth event:', error)
  } finally {
    client.release()
  }
}
