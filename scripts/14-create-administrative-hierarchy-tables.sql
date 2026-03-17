-- Administrative Hierarchy Tables for Civilio Governance System

-- Jurisdictions table (Cities, Districts, Municipalities)
CREATE TABLE IF NOT EXISTS jurisdictions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  parent_id INTEGER REFERENCES jurisdictions(id),
  population INTEGER,
  area_sq_km DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrative Roles hierarchy
CREATE TABLE IF NOT EXISTS admin_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  level INTEGER NOT NULL,
  description TEXT,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrator accounts linked to roles and jurisdictions
CREATE TABLE IF NOT EXISTS administrators (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  role_id INTEGER NOT NULL REFERENCES admin_roles(id),
  jurisdiction_id INTEGER NOT NULL REFERENCES jurisdictions(id),
  department_id INTEGER,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hierarchical relationships (superior-subordinate mapping)
CREATE TABLE IF NOT EXISTS admin_hierarchy (
  id SERIAL PRIMARY KEY,
  superior_id INTEGER NOT NULL REFERENCES administrators(id),
  subordinate_id INTEGER NOT NULL REFERENCES administrators(id),
  relationship_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(superior_id, subordinate_id)
);

-- Delegation records
CREATE TABLE IF NOT EXISTS delegations (
  id SERIAL PRIMARY KEY,
  delegating_admin_id INTEGER NOT NULL REFERENCES administrators(id),
  delegated_to_admin_id INTEGER NOT NULL REFERENCES administrators(id),
  delegation_type VARCHAR(100),
  scope JSONB,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issue escalation tracking
CREATE TABLE IF NOT EXISTS issue_escalations (
  id SERIAL PRIMARY KEY,
  grievance_id VARCHAR(255) NOT NULL,
  escalated_from_id INTEGER REFERENCES administrators(id),
  escalated_to_id INTEGER NOT NULL REFERENCES administrators(id),
  escalation_reason TEXT NOT NULL,
  escalation_level INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Department Authority mapping
CREATE TABLE IF NOT EXISTS department_authorities (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES administrators(id),
  department_name VARCHAR(255) NOT NULL,
  department_head_id INTEGER REFERENCES administrators(id),
  jurisdiction_id INTEGER NOT NULL REFERENCES jurisdictions(id),
  responsibility_areas JSONB,
  budget DECIMAL(15, 2),
  staff_count INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accountability & Performance tracking
CREATE TABLE IF NOT EXISTS admin_performance_metrics (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES administrators(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  issues_assigned INTEGER DEFAULT 0,
  issues_resolved INTEGER DEFAULT 0,
  avg_resolution_time_days DECIMAL(5, 2),
  citizen_satisfaction_score DECIMAL(3, 2),
  escalation_rate DECIMAL(5, 2),
  delegation_efficiency DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit trail for all administrative actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES administrators(id),
  action VARCHAR(100) NOT NULL,
  target_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_administrators_role_id ON administrators(role_id);
CREATE INDEX IF NOT EXISTS idx_administrators_jurisdiction_id ON administrators(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_admin_hierarchy_superior ON admin_hierarchy(superior_id);
CREATE INDEX IF NOT EXISTS idx_admin_hierarchy_subordinate ON admin_hierarchy(subordinate_id);
CREATE INDEX IF NOT EXISTS idx_delegations_delegating ON delegations(delegating_admin_id);
CREATE INDEX IF NOT EXISTS idx_delegations_delegated_to ON delegations(delegated_to_admin_id);
CREATE INDEX IF NOT EXISTS idx_issue_escalations_grievance ON issue_escalations(grievance_id);
CREATE INDEX IF NOT EXISTS idx_department_authorities_admin ON department_authorities(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);

-- Insert default administrative roles
INSERT INTO admin_roles (name, level, description, permissions) VALUES
  ('chief_minister', 1, 'Chief Minister - Top level executive authority', '{"can_delegate": true, "can_escalate": false, "can_approve": true, "can_assign_departments": true}'::jsonb),
  ('district_magistrate', 2, 'District Magistrate - District level administrator', '{"can_delegate": true, "can_escalate": true, "can_approve": true, "can_assign_departments": true}'::jsonb),
  ('deputy_district_magistrate', 3, 'Deputy District Magistrate - Support to DM', '{"can_delegate": false, "can_escalate": true, "can_approve": false, "can_assign_departments": false}'::jsonb),
  ('mayor', 4, 'Mayor - Municipal level executive', '{"can_delegate": false, "can_escalate": true, "can_approve": true, "can_assign_departments": false}'::jsonb),
  ('municipal_commissioner', 5, 'Municipal Commissioner - Department head', '{"can_delegate": false, "can_escalate": true, "can_approve": false, "can_assign_departments": false}'::jsonb),
  ('department_head', 6, 'Department Head - Execution authority', '{"can_delegate": false, "can_escalate": true, "can_approve": false, "can_assign_departments": false}'::jsonb),
  ('worker', 7, 'Field Worker/Vendor - Task executor', '{"can_delegate": false, "can_escalate": true, "can_approve": false, "can_assign_departments": false}'::jsonb)
ON CONFLICT DO NOTHING;
