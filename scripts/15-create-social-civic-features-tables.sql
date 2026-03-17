-- Citizen Profiles and Reputation System
CREATE TABLE IF NOT EXISTS citizen_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  profile_picture_url TEXT,
  bio TEXT,
  neighborhood_locality VARCHAR(255),
  civic_points BIGINT DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  total_grievances_filed INTEGER DEFAULT 0,
  total_solutions_contributed INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  featured_in_newspaper BOOLEAN DEFAULT FALSE,
  featured_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT positive_civic_points CHECK (civic_points >= 0)
);

-- Social Feed / Problem Reports with Images
CREATE TABLE IF NOT EXISTS civic_feed_posts (
  id BIGSERIAL PRIMARY KEY,
  citizen_id BIGINT NOT NULL REFERENCES citizen_profiles(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- Road, Water, Waste, etc.
  location_description VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  post_type VARCHAR(50) NOT NULL, -- 'problem_report', 'solution_idea', 'positive_action'
  status VARCHAR(50) DEFAULT 'active', -- active, resolved, in_progress
  engagement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images attached to posts
CREATE TABLE IF NOT EXISTS post_images (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES civic_feed_posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT max_images_per_post CHECK (
    (SELECT COUNT(*) FROM post_images WHERE post_id = post_id) <= 10
  )
);

-- Post Engagement (Likes, Comments, Shares)
CREATE TABLE IF NOT EXISTS post_engagements (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES civic_feed_posts(id) ON DELETE CASCADE,
  citizen_id BIGINT NOT NULL REFERENCES citizen_profiles(id) ON DELETE CASCADE,
  engagement_type VARCHAR(50) NOT NULL, -- 'like', 'comment', 'share', 'support'
  comment_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, citizen_id, engagement_type)
);

-- Government Achievements and Positive Actions
CREATE TABLE IF NOT EXISTS government_achievements (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location_description VARCHAR(500),
  before_image_url TEXT,
  after_image_url TEXT,
  completion_date TIMESTAMP,
  timeline_description TEXT,
  impact_description TEXT,
  status VARCHAR(50) DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  engagement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Smart City Newspaper / Featured Stories
CREATE TABLE IF NOT EXISTS newspaper_stories (
  id BIGSERIAL PRIMARY KEY,
  story_type VARCHAR(50) NOT NULL, -- 'featured_citizen', 'government_action', 'community_impact'
  featured_citizen_id BIGINT REFERENCES citizen_profiles(id) ON DELETE SET NULL,
  government_action_id BIGINT REFERENCES government_achievements(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  civic_values VARCHAR(500), -- Why they were featured (e.g., "Dedication to Public Service")
  published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  featured_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_position INTEGER,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Civic Points Proof of Work / Validation
CREATE TABLE IF NOT EXISTS civic_proof_of_work (
  id BIGSERIAL PRIMARY KEY,
  citizen_id BIGINT NOT NULL REFERENCES citizen_profiles(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL, -- 'grievance_filed', 'solution_implemented', 'community_participation', 'positive_feedback'
  description TEXT NOT NULL,
  points_earned BIGINT NOT NULL DEFAULT 0,
  evidence_url TEXT, -- Link to proof (grievance ID, post ID, feedback ID, etc.)
  verified BOOLEAN DEFAULT FALSE,
  verified_by BIGINT, -- Admin who verified
  verified_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT positive_points CHECK (points_earned >= 0)
);

-- Civic Leaderboard (Materialized View Cache)
CREATE TABLE IF NOT EXISTS civic_leaderboard (
  id BIGSERIAL PRIMARY KEY,
  citizen_id BIGINT NOT NULL UNIQUE REFERENCES citizen_profiles(id),
  rank INTEGER NOT NULL,
  total_civic_points BIGINT NOT NULL,
  engagement_score DECIMAL(5, 2),
  featured_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proof of Work Approval Queue (for admins to validate work)
CREATE TABLE IF NOT EXISTS proof_of_work_approvals (
  id BIGSERIAL PRIMARY KEY,
  proof_id BIGINT NOT NULL REFERENCES civic_proof_of_work(id) ON DELETE CASCADE,
  citizen_id BIGINT NOT NULL REFERENCES citizen_profiles(id),
  admin_id BIGINT NOT NULL, -- Approving admin
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrative Hierarchy
CREATE TABLE IF NOT EXISTS administrative_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  role_type VARCHAR(50) NOT NULL, -- 'chief_minister', 'mayor', 'district_magistrate', 'deputy_dm', 'department_authority'
  jurisdiction_id BIGINT, -- District/Municipality ID
  jurisdiction_name VARCHAR(255),
  department VARCHAR(255), -- For department authorities
  designation VARCHAR(255),
  authority_level INTEGER, -- 1=Chief Minister, 2=Mayor, 3=DM, 4=DDM, 5=Dept Head
  can_delegate BOOLEAN DEFAULT TRUE,
  can_escalate BOOLEAN DEFAULT TRUE,
  supervisor_id BIGINT REFERENCES administrative_roles(id), -- Direct superior
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_citizen_profiles_civic_points ON citizen_profiles(civic_points DESC);
CREATE INDEX idx_civic_feed_citizen ON civic_feed_posts(citizen_id);
CREATE INDEX idx_civic_feed_created ON civic_feed_posts(created_at DESC);
CREATE INDEX idx_civic_feed_status ON civic_feed_posts(status);
CREATE INDEX idx_post_engagements_post ON post_engagements(post_id);
CREATE INDEX idx_post_engagements_citizen ON post_engagements(citizen_id);
CREATE INDEX idx_government_achievements_created ON government_achievements(created_at DESC);
CREATE INDEX idx_newspaper_stories_featured ON newspaper_stories(featured_date DESC);
CREATE INDEX idx_civic_proof_verified ON civic_proof_of_work(verified);
CREATE INDEX idx_leaderboard_rank ON civic_leaderboard(rank);
CREATE INDEX idx_admin_roles_user ON administrative_roles(user_id);
CREATE INDEX idx_admin_roles_jurisdiction ON administrative_roles(jurisdiction_id);
