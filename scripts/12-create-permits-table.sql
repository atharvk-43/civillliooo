-- Permits & Licenses: Track citizen permits and licenses
CREATE TABLE permits (
  id SERIAL PRIMARY KEY,
  permit_number VARCHAR(50) UNIQUE NOT NULL,
  permit_type VARCHAR(100) NOT NULL, -- building, trade, event, vendor, etc.
  citizen_name VARCHAR(255) NOT NULL,
  citizen_email VARCHAR(255),
  citizen_phone VARCHAR(20),
  address TEXT,
  zone VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, approved, rejected, expired
  application_date DATE DEFAULT CURRENT_DATE,
  approval_date DATE,
  expiry_date DATE,
  fee_amount DECIMAL(12, 2),
  payment_status VARCHAR(50) DEFAULT 'pending',
  documents JSONB, -- store document URLs
  assigned_to VARCHAR(100), -- officer reviewing permit
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permit_type ON permits(permit_type);
CREATE INDEX idx_permit_status ON permits(status);
CREATE INDEX idx_permit_zone ON permits(zone);
