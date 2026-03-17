-- Citizen Verification Table
CREATE TABLE IF NOT EXISTS citizen_verification (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  identification_type VARCHAR(50) NOT NULL, -- 'aadhar', 'pan', 'epic' (voter id)
  identification_number VARCHAR(255) NOT NULL,
  identification_hash VARCHAR(255) NOT NULL, -- bcrypt hash of identification number
  phone_number VARCHAR(20),
  date_of_birth DATE,
  locality VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_timestamp TIMESTAMP,
  verification_document_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(identification_type, identification_number)
);

-- Leader/Administrator Verification Table
CREATE TABLE IF NOT EXISTS leader_verification (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL, -- 'chief_minister', 'district_magistrate', 'deputy_district_magistrate', 'mayor', 'municipal_commissioner', 'department_head'
  jurisdiction VARCHAR(255) NOT NULL,
  appointment_letter_url VARCHAR(500),
  appointment_letter_hash VARCHAR(255),
  appointment_date DATE,
  phone_number VARCHAR(20),
  office_address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_timestamp TIMESTAMP,
  verified_by_user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(position, jurisdiction)
);

-- Worker/Vendor Verification Table
CREATE TABLE IF NOT EXISTS vendor_worker_verification (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  worker_type VARCHAR(100) NOT NULL, -- 'vendor', 'worker', 'contractor', 'supplier'
  appointment_id VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  department VARCHAR(255),
  designation VARCHAR(255),
  permission_document_url VARCHAR(500),
  permission_document_hash VARCHAR(255),
  permission_document_expiry DATE,
  municipal_approval_number VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_timestamp TIMESTAMP,
  verified_by_user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(appointment_id)
);

-- Authentication Audit Trail
CREATE TABLE IF NOT EXISTS auth_audit_trail (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  user_type VARCHAR(50), -- 'citizen', 'leader', 'worker'
  action VARCHAR(100), -- 'login_attempt', 'verification_submitted', 'verification_approved', 'verification_rejected', 'logout'
  status VARCHAR(50), -- 'success', 'failed', 'pending'
  ip_address VARCHAR(50),
  user_agent TEXT,
  reason_for_failure TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session Management Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  session_token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(50),
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_citizen_verification_email ON citizen_verification(email);
CREATE INDEX IF NOT EXISTS idx_citizen_verification_id_number ON citizen_verification(identification_number);
CREATE INDEX IF NOT EXISTS idx_leader_verification_email ON leader_verification(email);
CREATE INDEX IF NOT EXISTS idx_leader_verification_position ON leader_verification(position);
CREATE INDEX IF NOT EXISTS idx_vendor_worker_verification_email ON vendor_worker_verification(email);
CREATE INDEX IF NOT EXISTS idx_vendor_worker_verification_appointment ON vendor_worker_verification(appointment_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON auth_audit_trail(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
