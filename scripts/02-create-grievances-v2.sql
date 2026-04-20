-- Create grievances table with proper schema
CREATE TABLE IF NOT EXISTS grievances (
  id BIGSERIAL PRIMARY KEY,
  tracking_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  location TEXT NOT NULL,
  ward VARCHAR(100),
  pincode VARCHAR(10),
  complainant_name VARCHAR(255) NOT NULL,
  complainant_email VARCHAR(255),
  complainant_phone VARCHAR(20),
  assigned_to VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_grievances_tracking_id ON grievances(tracking_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_category ON grievances(category);
CREATE INDEX IF NOT EXISTS idx_grievances_ward ON grievances(ward);
CREATE INDEX IF NOT EXISTS idx_grievances_created_at ON grievances(created_at DESC);

-- Enable RLS if needed
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow inserts
CREATE POLICY "Allow inserts" ON grievances
  FOR INSERT
  WITH CHECK (true);

-- Create RLS policy to allow reads
CREATE POLICY "Allow reads" ON grievances
  FOR SELECT
  USING (true);

-- Create RLS policy to allow updates
CREATE POLICY "Allow updates" ON grievances
  FOR UPDATE
  USING (true);
