-- Expenditures: Track actual spending against budgets
CREATE TABLE expenditures (
  id SERIAL PRIMARY KEY,
  reference_type VARCHAR(50) NOT NULL, -- work_order, purchase_order, contract
  reference_id VARCHAR(50) NOT NULL,
  budget_code VARCHAR(50) NOT NULL REFERENCES budgets(budget_code),
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  vendor VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exp_budget ON expenditures(budget_code);
CREATE INDEX idx_exp_ref_type ON expenditures(reference_type);
