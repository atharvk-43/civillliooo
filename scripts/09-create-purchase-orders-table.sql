-- Purchase Orders: Track procurement and vendor management
CREATE TABLE purchase_orders (
  id SERIAL PRIMARY KEY,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  vendor_id INTEGER,
  vendor_name VARCHAR(255) NOT NULL,
  work_order_id INTEGER REFERENCES work_orders(id),
  description TEXT NOT NULL,
  quantity DECIMAL(12, 2),
  unit_price DECIMAL(12, 2),
  total_amount DECIMAL(12, 2) NOT NULL,
  budget_code VARCHAR(50) REFERENCES budgets(budget_code),
  status VARCHAR(50) DEFAULT 'draft', -- draft, approved, sent, received, completed
  priority VARCHAR(20) DEFAULT 'normal',
  order_date DATE,
  delivery_date DATE,
  received_date DATE,
  payment_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)
);

CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_budget ON purchase_orders(budget_code);
