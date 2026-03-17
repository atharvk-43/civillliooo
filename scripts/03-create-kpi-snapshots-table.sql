-- Create table for storing real-time KPI snapshots
CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id SERIAL PRIMARY KEY,
  module VARCHAR(100) NOT NULL,
  kpi_name VARCHAR(100) NOT NULL,
  kpi_value DECIMAL(15, 2),
  kpi_unit VARCHAR(50),
  trend_direction VARCHAR(10),
  trend_percentage DECIMAL(5, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create composite index for efficient KPI querying
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_module_name ON kpi_snapshots(module, kpi_name);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_timestamp ON kpi_snapshots(timestamp DESC);
