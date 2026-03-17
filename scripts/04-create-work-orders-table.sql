-- Work Orders: Track tasks, repairs, maintenance, and operational activities
CREATE TABLE work_orders (
  id SERIAL PRIMARY KEY,
  wo_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  module VARCHAR(100) NOT NULL, -- city_management, traffic, energy, waste, etc.
  work_type VARCHAR(100) NOT NULL, -- maintenance, repair, installation, inspection
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  assigned_to VARCHAR(100), -- employee/team ID
  assigned_department VARCHAR(100),
  location_description TEXT,
  estimated_hours DECIMAL(8, 2),
  actual_hours DECIMAL(8, 2),
  estimated_cost DECIMAL(12, 2),
  actual_cost DECIMAL(12, 2),
  budget_code VARCHAR(50), -- links to financial budgets
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  notes TEXT
);

CREATE INDEX idx_wo_module ON work_orders(module);
CREATE INDEX idx_wo_status ON work_orders(status);
CREATE INDEX idx_wo_assigned ON work_orders(assigned_to);
CREATE INDEX idx_wo_priority ON work_orders(priority);
