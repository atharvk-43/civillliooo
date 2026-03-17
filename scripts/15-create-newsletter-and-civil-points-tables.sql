-- Newsletter and Community Updates Table
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  featured_issue_id INTEGER,
  author_id VARCHAR(255),
  author_name VARCHAR(255),
  thumbnail_url VARCHAR(500),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft'
);

-- Civil Points Tracking Table
CREATE TABLE IF NOT EXISTS civil_points (
  id SERIAL PRIMARY KEY,
  citizen_id VARCHAR(255),
  citizen_name VARCHAR(255),
  locality VARCHAR(255),
  mla_jurisdiction VARCHAR(255),
  total_points INTEGER DEFAULT 0,
  problems_reported INTEGER DEFAULT 0,
  problems_resolved INTEGER DEFAULT 0,
  verified_outcomes INTEGER DEFAULT 0,
  points_from_reports INTEGER DEFAULT 0,
  points_from_resolutions INTEGER DEFAULT 0,
  points_from_verification INTEGER DEFAULT 0,
  rank VARCHAR(50),
  badge_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Civil Points Ledger (for tracking individual transactions)
CREATE TABLE IF NOT EXISTS civil_points_ledger (
  id SERIAL PRIMARY KEY,
  citizen_id VARCHAR(255),
  grievance_id INTEGER,
  points_awarded INTEGER,
  reason VARCHAR(255),
  verified_by VARCHAR(255),
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MLA/Locality Civil Points Aggregation
CREATE TABLE IF NOT EXISTS locality_civil_points (
  id SERIAL PRIMARY KEY,
  locality_name VARCHAR(255),
  mla_name VARCHAR(255),
  mla_id VARCHAR(255),
  total_citizen_points INTEGER DEFAULT 0,
  problems_reported INTEGER DEFAULT 0,
  problems_resolved INTEGER DEFAULT 0,
  active_citizens INTEGER DEFAULT 0,
  resolution_rate DECIMAL(5, 2),
  rank INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Featured Citizens
CREATE TABLE IF NOT EXISTS newsletter_featured_citizens (
  id SERIAL PRIMARY KEY,
  newsletter_id INTEGER REFERENCES newsletters(id) ON DELETE CASCADE,
  citizen_id VARCHAR(255),
  citizen_name VARCHAR(255),
  citizen_email VARCHAR(255),
  grievance_id INTEGER,
  grievance_title VARCHAR(255),
  reason_featured TEXT,
  featured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community News/Updates
CREATE TABLE IF NOT EXISTS community_updates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  update_type VARCHAR(100),
  locality VARCHAR(255),
  image_url VARCHAR(500),
  impact_description TEXT,
  government_action TEXT,
  resolution_date DATE,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE
);

-- Newsletter Engagement Tracking
CREATE TABLE IF NOT EXISTS newsletter_engagement (
  id SERIAL PRIMARY KEY,
  newsletter_id INTEGER REFERENCES newsletters(id) ON DELETE CASCADE,
  user_id VARCHAR(255),
  viewed_at TIMESTAMP,
  engaged_at TIMESTAMP,
  engagement_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletters_published ON newsletters(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_featured ON newsletters(is_featured, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_civil_points_citizen ON civil_points(citizen_id);
CREATE INDEX IF NOT EXISTS idx_civil_points_locality ON civil_points(locality);
CREATE INDEX IF NOT EXISTS idx_civil_points_rank ON civil_points(rank);
CREATE INDEX IF NOT EXISTS idx_locality_civil_points_mla ON locality_civil_points(mla_id);
CREATE INDEX IF NOT EXISTS idx_community_updates_locality ON community_updates(locality);
CREATE INDEX IF NOT EXISTS idx_civil_points_ledger_citizen ON civil_points_ledger(citizen_id);
