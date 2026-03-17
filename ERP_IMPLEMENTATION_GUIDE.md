# Smart City ERP System - Implementation Guide

Your Smart City Data ERP application now includes a complete enterprise resource planning system for government operations. This guide covers all components and next steps.

## Project Architecture

### Two-Layer System

**1. Monitoring & Analytics Layer** (7 modules)
- City Management, Traffic & Mobility, Energy & Utilities, Waste Management
- Citizen Services, Risk & Emergency Response, Sustainability
- Purpose: Real-time dashboards for city leadership to understand what's happening

**2. ERP Execution Layer** (6 modules)
- Work Orders, Financial Management, Assets & Maintenance, Procurement, HR, Permits
- Purpose: Operationalize decisions by creating actual work items, tracking budgets, managing people

---

## Database Schema Overview

All tables have been created in `/scripts/04-13-*.sql`. Execute them in order:

### Core ERP Tables

1. **work_orders** - Operational tasks (repairs, maintenance, inspections)
   - Tracks: WO number, priority, status, assignments, hours, costs
   - Used by: All departments for task execution

2. **budgets** - Departmental budget allocation
   - Tracks: Allocated amount, spent, committed, available
   - Used by: Financial planning and purchase order approval

3. **expenditures** - Actual spending records
   - Links: Work orders, purchase orders to budgets
   - Tracks: Budget utilization and financial compliance

4. **assets** - City infrastructure, vehicles, equipment
   - Tracks: Asset type, purchase cost, current value, maintenance dates
   - Used by: Preventive maintenance scheduling

5. **maintenance_schedules** - Preventive & corrective maintenance
   - Links: Assets to work orders
   - Tracks: Scheduled dates, completion status, costs

6. **purchase_orders** - Procurement tracking
   - Tracks: Vendor, order status, delivery, payment
   - Links: To budgets and work orders

7. **vendors** - Supplier management
   - Tracks: Vendor ratings, total spent, contact info
   - Used by: Procurement planning

8. **employees** - Staff management
   - Tracks: Department, role, hire date, availability
   - Used by: Work order assignment and capacity planning

9. **permits** - Citizen permit applications
   - Tracks: Application status, approvals, fees
   - Used by: Regulatory compliance and revenue

10. **licenses** - Business & professional licenses
    - Tracks: License status, renewal dates, fees
    - Used by: Regulatory oversight

---

## Module Descriptions

### Work Orders & Task Management (`/erp/work-orders`)

**Purpose**: Create and track all operational tasks across the city

**Key Features**:
- Create work orders from recommended actions in analytics dashboards
- Assign to departments and individuals
- Track estimated vs actual hours and costs
- Filter by status, priority, department
- Real-time progress tracking

**Example Workflow**:
1. Analytics dashboard shows "Water pump maintenance overdue"
2. Click "Schedule maintenance" → Creates work order WO-2024-XXX
3. Assign to Utilities dept → Status changes to "assigned"
4. Worker marks "in progress" → Tracks actual hours
5. Worker marks "completed" → Updates asset maintenance date

**Integration Points**:
- Links to Assets table for preventive maintenance
- Links to Budgets for cost tracking
- Links to Employees for assignment

---

### Financial Management & Budgeting (`/erp/financial`)

**Purpose**: Control departmental spending and monitor budget utilization

**Key Features**:
- View total allocated vs spent vs committed budget
- Track spending by department
- Monitor budget utilization percentage
- Visual trend analysis of monthly expenditures
- Department-level budget drill-down

**Budget States**:
- Allocated: Total money available
- Spent: Actual payments made
- Committed: Pending purchase orders
- Available: Allocated - Spent - Committed

**Example Workflow**:
1. Transportation dept has $2.5M allocated budget
2. They've spent $1.85M and have $200k in pending orders
3. Available: $450k for remaining FY
4. When approving a $100k purchase order, committed increases, available decreases

---

### Asset & Maintenance Management (`/erp/assets`)

**Purpose**: Track city assets and schedule preventive maintenance

**Key Features**:
- Register vehicles, equipment, infrastructure
- Track purchase cost and current value
- Schedule preventive maintenance by interval
- Alert on overdue maintenance
- Monitor operating hours and depreciation

**Asset Types**:
- Vehicles (waste trucks, sweepers, etc.)
- Equipment (pumps, compactors, etc.)
- Infrastructure (traffic lights, water stations, etc.)

**Maintenance Tracking**:
- Last maintenance date
- Next scheduled maintenance date
- Maintenance interval (days)
- Status: Scheduled, overdue, completed

---

### Procurement & Vendor Management (`/erp/procurement`)

**Purpose**: Manage purchase orders and vendor relationships

**Key Features**:
- Create purchase orders linked to budgets
- Track PO status (draft → approved → sent → received → completed)
- Monitor vendor performance and ratings
- Track payment status
- Manage approved vendor list

**PO Workflow**:
1. Work order needs equipment: Create PO
2. Manager approves → PO sent to vendor
3. Vendor delivers → Mark "received"
4. Verify quality → Mark "completed"
5. Finance processes payment

**Vendor Management**:
- Track total spent with each vendor
- Monitor vendor ratings (quality, reliability)
- Payment terms and contact info

---

### HR & Workforce Management (`/erp/hr`)

**Purpose**: Manage employees and workforce deployment

**Key Features**:
- Employee directory with skills inventory
- Department distribution and headcount
- Availability status (available, on assignment, on leave)
- Manager-subordinate relationships
- Salary and hire date tracking

**Availability States**:
- Available: Ready for assignment
- On Assignment: Currently assigned to work order
- On Leave: Temporarily unavailable

**Use Cases**:
- Assign qualified technician to urgent repair
- Check department staffing levels
- Plan seasonal staffing (holidays, events)
- Track skill inventory for specialized work

---

### Permits & Licensing (`/erp/permits`)

**Purpose**: Process citizen permits and manage business licenses

**Key Features**:
- Building permits, trade licenses, event permits, vendor licenses
- Application tracking (submitted → under review → approved/rejected)
- Fee collection and payment status
- License expiration tracking and renewal
- Officer assignment and SLA monitoring

**Permit Types**:
- Building: Foundation, renovation, electrical permits
- Trade: Contractor licenses, professional credentials
- Event: Street closures, festivals, gatherings
- Vendor: Food trucks, market stalls, mobile services

**License Types**:
- Business: Retail, restaurants, services
- Professional: Engineering, architecture, contracting

---

## Integration with Analytics Dashboards

### Recommended Actions Flow

Each analytics dashboard now has "Recommended Actions" with buttons to create ERP work items:

**Example**: Traffic & Mobility Module
- Alert: "Traffic light at Main St intersection malfunctioning"
- Recommended Action: "Schedule traffic light repair"
- Click button → Creates Work Order WO-2024-XXX
- Router: Transportation Department
- Status: Open (waiting for assignment)

**Example**: Energy & Utilities
- Alert: "Water pump maintenance 15 days overdue"
- Recommended Action: "Schedule preventive maintenance"
- Click button → Creates Work Order
- Links to Asset ID: EQ-001
- Auto-populates: Maintenance history, estimated hours, location

---

## Next Steps: Database Integration

To make this a fully operational ERP:

### Step 1: Execute SQL Scripts

Run all migration scripts in `/scripts/` folder:
\`\`\`bash
psql -U user -d database -f scripts/04-create-work-orders-table.sql
psql -U user -d database -f scripts/05-create-budgets-table.sql
# ... continue for all 10 scripts
\`\`\`

### Step 2: Connect API Endpoints

Update API routes in `/app/api/`:

**Work Orders**:
- `GET /api/work-orders` - Fetch all
- `POST /api/work-orders` - Create new
- `PATCH /api/work-orders/[id]` - Update status/hours/costs

**Financial**:
- `GET /api/budgets` - Fetch budget data
- `GET /api/expenditures` - Track spending

**Assets**:
- `GET /api/assets` - Asset list
- `POST /api/maintenance-schedules` - Schedule maintenance

**Procurement**:
- `GET /api/purchase-orders` - PO tracking
- `GET /api/vendors` - Vendor data

### Step 3: Connect to Database

Replace mock data in each page with real queries using Neon:

\`\`\`typescript
// Example: Work Orders page
const workOrders = await sql`SELECT * FROM work_orders WHERE status != 'completed' ORDER BY priority DESC`;
\`\`\`

### Step 4: Add Real-time Updates

Integrate WebSockets for live updates:
- Budget utilization changes
- Work order status updates
- Asset maintenance alerts
- Permit approvals

---

## Role-Based Access Control

Recommended user roles:

1. **City Administrator**
   - Access: All modules
   - Permissions: Create/edit/delete anything

2. **Department Manager** (Transportation, Utilities, etc.)
   - Access: Work orders, assets, HR for their dept
   - Permissions: Assign work, approve budget spend

3. **Finance Officer**
   - Access: Financial management, budgets, expenditures
   - Permissions: Budget allocation, purchase approval

4. **HR Manager**
   - Access: HR & Workforce module
   - Permissions: Employee management, assignments

5. **Operations Technician**
   - Access: Work orders (assigned to them)
   - Permissions: Update work order status, log hours

6. **Citizen** (External)
   - Access: Grievance portal, permit application
   - Permissions: Submit permits, view status

---

## Key Performance Indicators

Track these metrics for city operations:

### Operational Efficiency
- Average work order completion time
- Work order cost variance (estimated vs actual)
- Equipment asset utilization rate
- Maintenance schedule adherence

### Financial Health
- Budget utilization by department
- Cost per work order
- Purchase order approval time
- Vendor performance (on-time delivery %)

### Workforce Management
- Employee utilization (% on assignment)
- Skill match for assignments
- Department headcount vs optimal

### Citizen Services
- Permit application processing time
- Permit approval rate
- License renewal rate
- Grievance resolution time

---

## Security Considerations

Before going live:

1. **Data Protection**
   - Enable Row Level Security (RLS) on all tables
   - Create policies for each user role
   - Encrypt sensitive data (salaries, social security)

2. **Audit Logging**
   - Log all changes to budgets, permits, work orders
   - Track who created, modified, deleted records
   - Maintain compliance audit trail

3. **Access Control**
   - Implement role-based permissions
   - Department managers can only see their department data
   - Finance can only approve budgets they own

4. **Data Validation**
   - Validate work order creation (assigned employee exists, etc.)
   - Check budget availability before creating purchase orders
   - Verify permit applications have required documents

---

## Example: Creating a Complete Workflow

### Scenario: Street pothole repair

**Step 1: Alert in Analytics**
- City Management dashboard shows: "Critical pothole on Park Ave"
- Recommended action: "Create repair work order"

**Step 2: Create Work Order**
- Click → New Work Order created: WO-2024-0847
- Department: Infrastructure
- Work Type: Repair
- Priority: High
- Estimated: 4 hours, $800

**Step 3: Assign & Budget**
- Assign to: Mike Johnson (Infrastructure team)
- Link to budget: INF-001 (Capital Repairs)
- Status: "assigned"

**Step 4: Execute**
- Mike marks "in progress"
- Tracks actual time: 3.5 hours
- Logs actual cost from materials: $650
- Marks "completed"

**Step 5: Financials Update**
- Expenditure recorded: $650 against INF-001 budget
- Budget available decreased from $400k to $399.35k
- Work order shows 21.8% cost savings vs estimate

**Step 6: Analytics Update**
- City Management dashboard: "Pothole repaired - On budget"
- Infrastructure module updated with completion status

---

## Reporting & Exports

The system enables:
- Executive summaries (budgets, KPIs, alerts)
- Departmental performance reports
- Financial reconciliation reports
- Work order completion reports
- Vendor performance scorecards
- HR staffing reports
- Citizen service metrics

All exportable to PDF, Excel for boardroom presentations.

---

## Support & Documentation

- **Database Schema**: See `/scripts/` folder for creation SQL
- **API Endpoints**: Check `/app/api/` for all available routes
- **Component Library**: Reusable components in `/components/`
- **Mock Data**: See `/lib/mock-data.ts` for example data structure

Good luck building a world-class Smart City ERP! 🚀
