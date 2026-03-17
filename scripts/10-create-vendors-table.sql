-- Vendors: Manage supplier and contractor information
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  vendor_code VARCHAR(50) UNIQUE NOT NULL,
  vendor_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  category VARCHAR(100), -- equipment, maintenance, services, etc.
  status VARCHAR(50) DEFAULT 'active',
  rating DECIMAL(3, 2),
  total_spent DECIMAL(12, 2) DEFAULT 0,
  payment_terms VARCHAR(100),
  tax_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendor_category ON vendors(category);
