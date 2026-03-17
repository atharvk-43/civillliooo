-- Create grievances table for the Citizen Grievance Portal
CREATE TABLE IF NOT EXISTS grievances (
  id SERIAL PRIMARY KEY,
  tracking_id VARCHAR(20) UNIQUE NOT NULL,
  citizen_name VARCHAR(255) NOT NULL,
  citizen_email VARCHAR(255) NOT NULL,
  citizen_phone VARCHAR(20) NOT NULL,
  issue_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location_description TEXT NOT NULL,
  zone VARCHAR(100) NOT NULL,
  attachment_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Submitted',
  priority VARCHAR(20) DEFAULT 'Medium',
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  resolution_notes TEXT
);

-- Create index for tracking ID lookups
CREATE INDEX IF NOT EXISTS idx_grievances_tracking_id ON grievances(tracking_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_zone ON grievances(zone);
CREATE INDEX IF NOT EXISTS idx_grievances_created_at ON grievances(created_at);
