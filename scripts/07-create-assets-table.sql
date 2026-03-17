-- Assets: Track city infrastructure, equipment, and vehicles
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  asset_code VARCHAR(50) UNIQUE NOT NULL,
  asset_name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(100) NOT NULL, -- vehicle, equipment, infrastructure, etc.
  category VARCHAR(100) NOT NULL, -- waste_truck, traffic_light, water_pump, etc.
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, under_maintenance, decommissioned
  location_description TEXT,
  purchase_date DATE,
  purchase_cost DECIMAL(12, 2),
  current_value DECIMAL(12, 2),
  warranty_expiry DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_interval_days INTEGER,
  operating_hours DECIMAL(12, 2) DEFAULT 0,
  fuel_type VARCHAR(50),
  license_plate VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_type ON assets(asset_type);
CREATE INDEX idx_asset_status ON assets(status);
CREATE INDEX idx_asset_maintenance ON assets(next_maintenance_date);
