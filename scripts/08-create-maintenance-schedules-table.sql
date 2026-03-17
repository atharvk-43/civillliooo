-- Maintenance Schedules: Track preventive and corrective maintenance
CREATE TABLE maintenance_schedules (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id),
  work_order_id INTEGER REFERENCES work_orders(id),
  maintenance_type VARCHAR(50) NOT NULL, -- preventive, corrective, emergency
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  status VARCHAR(50) DEFAULT 'scheduled',
  description TEXT,
  estimated_cost DECIMAL(12, 2),
  actual_cost DECIMAL(12, 2),
  technician VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maint_asset ON maintenance_schedules(asset_id);
CREATE INDEX idx_maint_scheduled ON maintenance_schedules(scheduled_date);
CREATE INDEX idx_maint_status ON maintenance_schedules(status);
