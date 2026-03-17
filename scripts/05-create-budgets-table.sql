-- Financial Budgets: Track departmental budgets and expenditures
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  budget_code VARCHAR(50) UNIQUE NOT NULL,
  fiscal_year INTEGER NOT NULL,
  department VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL, -- operations, maintenance, capital, etc.
  allocated_amount DECIMAL(12, 2) NOT NULL,
  spent_amount DECIMAL(12, 2) DEFAULT 0,
  committed_amount DECIMAL(12, 2) DEFAULT 0, -- pending purchase orders
  available_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)
);

CREATE INDEX idx_budget_dept ON budgets(department);
CREATE INDEX idx_budget_fiscal ON budgets(fiscal_year);
