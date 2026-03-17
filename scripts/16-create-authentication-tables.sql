-- Citizen Verification Table
CREATE TABLE IF NOT EXISTS citizen_verification (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  identification_type VARCHAR(50) NOT NULL CHECK (identification_type IN ('aadhar', 'pan', 'epic', 'other')),
  identification_number VARCHAR(255) NOT NULL,
  identification_hash VARCHAR(255) NOT NULL,
  locality VARCHAR(255),
  phone_number VARCHAR(20),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'manual_review')),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Administrative Leader Verification Table
CREATE TABLE IF NOT EXISTS leader_verification (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  admin_position VARCHAR(100) NOT NULL CHECK (admin_position IN ('chief_minister', 'district_magistrate', 'deputy_district_magistrate', 'mayor', 'municipal_commissioner', 'department_head')),
  jurisdiction_id INTEGER,
  department_id INTEGER,
  appointment_letter_number VARCHAR(255),
  appointment_date DATE,
  appointment_letter_hash VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'manual_review')),
  rejection_reason TEXT,
  official_email VARCHAR(255),
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Vendor/Worker Verification Table
CREATE TABLE IF NOT EXISTS vendor_worker_verification (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  worker_type VARCHAR(50) NOT NULL CHECK (worker_type IN ('vendor', 'contractor', 'department_staff', 'field_worker')),
  appointment_id VARCHAR(255) NOT NULL UNIQUE,
  municipality_id VARCHAR(255),
  department VARCHAR(255),
  designation VARCHAR(255),
  appointment_document_hash VARCHAR(255) NOT NULL,
  appointment_document_path VARCHAR(500),
  official_certificate_hash VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'manual_review')),
  rejection_reason TEXT,
  official_email VARCHAR(255),
  phone_number VARCHAR(20),
  supervisor_name VARCHAR(255),
  supervisor_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Session Table for authentication tracking
CREATE TABLE IF NOT EXISTS auth_sessions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('citizen', 'leader', 'worker')),
  session_token VARCHAR(500) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  logout_timestamp TIMESTAMP
);

-- Audit Log for authentication events
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id VARCHAR(255),
  user_type VARCHAR(50),
  status VARCHAR(50),
  ip_address VARCHAR(45),
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_citizen_verification_user_id ON citizen_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_citizen_verification_identification ON citizen_verification(identification_type, identification_number);
CREATE INDEX IF NOT EXISTS idx_leader_verification_user_id ON leader_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_leader_verification_position ON leader_verification(admin_position, jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_vendor_worker_verification_user_id ON vendor_worker_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_worker_verification_appointment ON vendor_worker_verification(appointment_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_created_at ON auth_audit_log(created_at);
