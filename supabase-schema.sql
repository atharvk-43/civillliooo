-- ============================================================
-- CIVILLIO DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New Query → Run All
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── GRIEVANCES TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grievances (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    tracking_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'roads', 'water', 'electricity', 'sanitation',
        'public_safety', 'parks', 'permits', 'noise', 'other'
    )),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_progress', 'resolved', 'rejected'
    )),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN (
        'low', 'medium', 'high', 'critical'
    )),
    location TEXT NOT NULL,
    ward TEXT,
    pincode TEXT,
    complainant_name TEXT NOT NULL,
    complainant_email TEXT,
    complainant_phone TEXT,
    assigned_to TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ
);

-- ─── WORK ORDERS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
        'open', 'assigned', 'in_progress', 'completed', 'cancelled'
    )),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN (
        'low', 'medium', 'high'
    )),
    category TEXT NOT NULL,
    assigned_to TEXT,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    grievance_id UUID REFERENCES grievances(id) ON DELETE SET NULL,
    budget_allocated NUMERIC(12, 2),
    budget_spent NUMERIC(12, 2) DEFAULT 0
);

-- ─── HR EMPLOYEES TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    joining_date DATE NOT NULL,
    salary NUMERIC(12, 2)
);

-- ─── PERMITS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    permit_number TEXT UNIQUE NOT NULL,
    applicant_name TEXT NOT NULL,
    permit_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'under_review', 'approved', 'rejected', 'expired'
    )),
    location TEXT NOT NULL,
    valid_from DATE,
    valid_until DATE,
    fee_paid NUMERIC(10, 2),
    notes TEXT
);

-- ─── SEED SAMPLE DATA ────────────────────────────────────────
INSERT INTO grievances (tracking_id, title, description, category, status, priority, location, complainant_name, complainant_email) VALUES
('CIV-2026-100001', 'Pothole on MG Road causing accidents', 'There is a massive pothole near MG Road junction that has been causing accidents for 2 weeks. Immediate repair needed.', 'roads', 'in_progress', 'high', 'MG Road, Sector 12', 'Rajesh Kumar', 'rajesh@example.com'),
('CIV-2026-100002', 'Water supply disrupted for 3 days', 'No water supply in our area for the past 3 days. Tap water has completely stopped.', 'water', 'pending', 'critical', 'Green Park Colony, Block B', 'Priya Sharma', 'priya@example.com'),
('CIV-2026-100003', 'Street lights not working', 'Street lights from post no. 45 to 62 on Ring Road are non-functional since last month.', 'electricity', 'pending', 'medium', 'Ring Road, Sector 4', 'Amit Singh', 'amit@example.com'),
('CIV-2026-100004', 'Garbage collection not done for a week', 'Garbage has not been collected from our street for over a week. It is overflowing and creating health hazards.', 'sanitation', 'resolved', 'high', 'Shanti Nagar, Ward 7', 'Sunita Patel', 'sunita@example.com'),
('CIV-2026-100005', 'Illegal construction blocking road', 'Unauthorized construction is blocking 50% of the road width making emergency vehicle access impossible.', 'permits', 'in_progress', 'critical', 'Civil Lines, Near Park', 'Vikram Mehta', 'vikram@example.com');

INSERT INTO work_orders (title, description, status, priority, category, assigned_to, budget_allocated, due_date) VALUES
('Pothole Repair - MG Road Sector 12', 'Fill and resurface potholes on MG Road near Sector 12 junction', 'in_progress', 'high', 'Roads & Infrastructure', 'PWD Team Alpha', 85000, '2026-04-01'),
('Water Pipeline Inspection - Green Park', 'Inspect and repair water pipeline serving Green Park Colony', 'open', 'high', 'Water Supply', 'Water Works Team B', 45000, '2026-03-28'),
('Street Light Replacement - Ring Road', 'Replace 18 non-functional street lights on Ring Road Sector 4', 'open', 'medium', 'Electricity', 'DISCOM Team 3', 120000, '2026-04-05'),
('Garbage Pickup Schedule Enforcement', 'Enforce daily garbage collection in Shanti Nagar Ward 7', 'completed', 'high', 'Sanitation', 'Sanitation Squad 2', 15000, '2026-03-20'),
('Illegal Construction Demolition Notice', 'Issue legal notice and coordinate demolition of unauthorized structure', 'in_progress', 'critical', 'Enforcement', 'Enforcement Wing A', 5000, '2026-03-25');

INSERT INTO employees (employee_id, full_name, email, phone, department, designation, joining_date, salary) VALUES
('EMP-001', 'Arun Sharma', 'arun.sharma@civillio.gov.in', '+91 98765 43210', 'Administration', 'Chief Administrator', '2020-01-15', 125000),
('EMP-002', 'Meena Gupta', 'meena.gupta@civillio.gov.in', '+91 87654 32109', 'PWD', 'Junior Engineer', '2022-06-01', 65000),
('EMP-003', 'Rajan Verma', 'rajan.verma@civillio.gov.in', '+91 76543 21098', 'Water Works', 'Technical Supervisor', '2019-03-20', 78000),
('EMP-004', 'Kavita Rao', 'kavita.rao@civillio.gov.in', '+91 65432 10987', 'Sanitation', 'Sanitation Inspector', '2023-08-10', 52000),
('EMP-005', 'Deepak Nair', 'deepak.nair@civillio.gov.in', '+91 54321 09876', 'Enforcement', 'Field Officer', '2021-11-05', 58000);

-- ─── ENABLE ROW LEVEL SECURITY ───────────────────────────────
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE permits ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for grievances (citizens can submit and track)
CREATE POLICY "Allow public grievance access" ON grievances FOR ALL USING (true) WITH CHECK (true);
-- Allow full access to work orders (internal use)
CREATE POLICY "Allow full work order access" ON work_orders FOR ALL USING (true) WITH CHECK (true);
-- Allow full access to employees
CREATE POLICY "Allow full employee access" ON employees FOR ALL USING (true) WITH CHECK (true);
-- Allow full access to permits
CREATE POLICY "Allow full permit access" ON permits FOR ALL USING (true) WITH CHECK (true);

-- ─── ENABLE REALTIME ──────────────────────────────────────────
-- Run these in Supabase → Database → Replication
ALTER PUBLICATION supabase_realtime ADD TABLE grievances;
ALTER PUBLICATION supabase_realtime ADD TABLE work_orders;

SELECT 'Schema created successfully! 🎉' AS message;
