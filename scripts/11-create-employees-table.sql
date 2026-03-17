-- Employees: Track workforce and deployment
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100) NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  salary DECIMAL(12, 2),
  hire_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, on_leave, terminated
  manager_id VARCHAR(50),
  skills TEXT, -- comma-separated or JSON
  availability_status VARCHAR(50) DEFAULT 'available', -- available, on_assignment, on_leave
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emp_dept ON employees(department);
CREATE INDEX idx_emp_status ON employees(status);
