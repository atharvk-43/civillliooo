-- Licenses: Business and professional licenses
CREATE TABLE licenses (
  id SERIAL PRIMARY KEY,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_type VARCHAR(100) NOT NULL, -- business, professional, vendor, etc.
  business_name VARCHAR(255),
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  category VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, expired, suspended, cancelled
  renewal_date DATE,
  fee_amount DECIMAL(12, 2),
  payment_status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_license_type ON licenses(license_type);
CREATE INDEX idx_license_status ON licenses(status);
