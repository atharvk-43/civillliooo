# Civilio Administrative Hierarchy System

## Overview

Civilio now features a comprehensive administrative hierarchy system that mirrors real-world municipal governance structures. The system enables jurisdiction-based access control, hierarchical escalation, and accountability tracking across multiple levels of administration.

## Administrative Roles & Authority Levels

### 1. Chief Minister (Level 1)
**Jurisdiction:** State/City-wide  
**Authority:** Highest  

**Responsibilities:**
- Oversee all municipal operations across districts
- Delegate matters to Mayors and District Magistrates
- Make strategic policy decisions
- Receive escalations from all lower levels
- Monitor performance of all administrators

**Key Powers:**
- Can delegate any grievance to any Mayor or District Magistrate
- Can override decisions made by lower levels
- Access to city-wide dashboards and analytics
- Can issue directives that flow down the hierarchy
- Approve high-impact policies and projects

**Dashboard Features:**
- City-wide grievance overview (all districts)
- Performance metrics by district and department
- Escalation queue from all districts
- Budget allocation and resource distribution
- Leadership effectiveness scorecard
- Delegation history and outcomes

---

### 2. Mayor (Level 2)
**Jurisdiction:** City/Municipal Corporation  
**Authority:** City-level  

**Responsibilities:**
- Manage city-wide services and infrastructure
- Route issues within jurisdiction to District Magistrates or departments
- Escalate critical issues to Chief Minister
- Coordinate between multiple wards/zones
- Ensure service delivery standards

**Key Powers:**
- Can assign grievances to District Magistrates in their jurisdiction
- Can escalate to Chief Minister
- Cannot bypass District Magistrate hierarchy within their zone
- Access to city-wide data but with some district-specific restrictions
- Can approve contracts and allocate resources to departments

**Escalation Path:**
Mayor → Chief Minister

**Dashboard Features:**
- City grievances filtered by ward/zone
- Department performance within city
- Escalation queue to Chief Minister
- Budget and resource allocation tools
- Service delivery dashboard
- Citizen satisfaction metrics by ward

---

### 3. District Magistrate (Level 3)
**Jurisdiction:** District  
**Authority:** District-level administration  

**Responsibilities:**
- Manage all grievances in district
- Assign work to Deputy District Magistrates and department authorities
- Monitor execution by field workers and vendors
- Escalate to Mayor for jurisdiction-level issues
- Ensure timely resolution of grievances

**Key Powers:**
- Can forward grievances to Deputy District Magistrates
- Can assign to Municipal Corporation Heads and Department Authorities
- Can escalate to Mayor or Chief Minister
- Can monitor work orders and deadlines
- Can override work orders that exceed deadlines
- Associate multiple departments and authorities

**Escalation Path:**
District Magistrate → Mayor → Chief Minister

**Associated Authorities Under DM:**
- Municipal Corporation Head (Roads, Water, Waste)
- Public Health Authority
- Education Department
- Commerce & Trade Authority
- Licensing Authority

**Dashboard Features:**
- All grievances in district with status
- Assignment and delegation workflow
- Deadline enforcement dashboard
- Deputy DM performance metrics
- Department authority effectiveness
- Work order tracking and approval
- Escalation history to Mayor

---

### 4. Deputy District Magistrate (Level 4)
**Jurisdiction:** Sub-district / Ward cluster  
**Authority:** Sub-district level  

**Responsibilities:**
- Handle specific category of grievances
- Coordinate with field workers
- Monitor daily execution
- Report to District Magistrate
- Escalate complex issues to DM

**Key Powers:**
- Can assign to department authorities and field workers
- Can monitor and track work progress
- Can request deadline extensions (subject to DM approval)
- Cannot override DM decisions
- Can escalate to District Magistrate

**Escalation Path:**
DDM → District Magistrate → Mayor → Chief Minister

**Dashboard Features:**
- Ward-level grievance queue
- Work team assignment tracking
- Daily progress monitoring
- Issue escalation queue to DM
- Performance metrics for work teams
- Deadline tracking dashboard

---

### 5. Department Authority / Department Head (Level 5)
**Jurisdiction:** Specific Department / Service Category  
**Authority:** Operational level  

**Responsibilities:**
- Execute assigned work orders
- Deploy field workers and vendors
- Report progress to DDM/DM
- Complete work within deadlines
- Provide status updates to citizens

**Key Powers:**
- Can assign work to field workers and contractors
- Can update work order status in real-time
- Can request resources from DM
- Cannot reassign grievances above their authority
- Must report to supervising DM/DDM

**Escalation Path:**
Cannot escalate directly; reports to assigned DDM/DM

**Dashboard Features:**
- Assigned work orders
- Field worker tracking
- Progress updates and photo documentation
- Timeline and deadline management
- Resource allocation
- Completion verification form

---

## Jurisdiction-Based Access Control

### Access Rules by Role

**Chief Minister:**
- View all data across all districts and departments
- No geographic restrictions
- Can view all grievances regardless of status
- Can access all escalation chains

**Mayor:**
- View all data within their city/municipality
- Cannot view other cities' data
- Can see district-level aggregates
- Restricted access to internal DM workflows

**District Magistrate:**
- View all data within their district
- Cannot view other districts' data
- Can see DDM and department workflows
- Full visibility into work orders and field teams

**Deputy District Magistrate:**
- View only assigned grievances and sub-district data
- Cannot view other DDMs' assignments
- Can see work teams under them
- Limited to their jurisdiction

**Department Authority:**
- View only assigned work orders
- Cannot see other departments' work
- Limited to operational data
- No access to policy/escalation data

---

## Escalation & Delegation Workflow

### Standard Escalation Path

```
Department Authority
    ↓
Deputy DM
    ↓
District Magistrate
    ↓
Mayor
    ↓
Chief Minister
```

### Circumstances for Escalation

**Automatic Escalation (Triggers):**
1. **Deadline Exceeded:** If grievance exceeds 7-day deadline, automatically escalate to next level
2. **Complexity:** Complex technical issues requiring higher authority decision
3. **Citizen Appeal:** If citizen files appeal against resolution
4. **Jurisdictional:** Issue spans multiple departments or districts
5. **Budget Exception:** Work exceeds allocated budget threshold

**Manual Escalation:**
1. Department Authority can request escalation through DM
2. DDM can escalate to DM if resources insufficient
3. DM can escalate to Mayor for policy/jurisdiction issues
4. Mayor can escalate to Chief Minister for city-wide impact

### Delegation Process

**From Chief Minister:**
- Can directly delegate to any Mayor or DM
- Bypass normal hierarchy if necessary
- Must record delegation reason
- Can override existing work orders
- Responsible for ensuring completion

**From Mayor:**
- Can delegate to specific District Magistrate
- Can specify priority and deadline
- Must stay within city jurisdiction
- DM can further delegate to DDMs

**From District Magistrate:**
- Can delegate to specific DDM or Department Authority
- Can assign specific work category
- Can set completion deadline
- Department Authority reports back to DM

**From Deputy DM:**
- Can assign to specific field team or contractor
- Reports to District Magistrate
- Cannot delegate to other DDMs
- Full accountability for assigned work

---

## Accountability & Audit Trail

### What Gets Tracked

1. **Every Action Log:**
   - Who took the action
   - What action was taken
   - Timestamp
   - Duration at each level
   - Outcome

2. **Escalation Tracking:**
   - Who escalated
   - Why it was escalated
   - Which level received it
   - Action taken at new level
   - Time to resolution at each level

3. **Delegation Tracking:**
   - Who delegated
   - To whom
   - Reason for delegation
   - Deadline assigned
   - Completion status
   - Performance against deadline

4. **Performance Metrics:**
   - Resolution time by role
   - Resolution rate by department
   - Escalation frequency
   - Deadline compliance
   - Citizen satisfaction by authority
   - Quality of work (based on feedback)

### Transparency Features

- **Complete Audit Trail:** Every action in the system is recorded
- **Open to Citizens:** Citizens can see the complete journey of their grievance
- **Performance Public:** Administrators' performance metrics are visible to superiors and public
- **Accountability Dashboard:** Shows which level delayed the process
- **Performance Reviews:** Automated performance reports for appraisals

---

## Database Schema

### Administrative Roles Table
```sql
CREATE TABLE administrative_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  role_type VARCHAR(50), -- chief_minister, mayor, district_magistrate, deputy_dm, department_authority
  jurisdiction_id BIGINT,
  jurisdiction_name VARCHAR(255),
  department VARCHAR(255),
  designation VARCHAR(255),
  authority_level INTEGER, -- 1=CM, 2=Mayor, 3=DM, 4=DDM, 5=Dept
  can_delegate BOOLEAN DEFAULT TRUE,
  can_escalate BOOLEAN DEFAULT TRUE,
  supervisor_id BIGINT, -- Direct superior
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Escalation & Delegation Tracking
```sql
CREATE TABLE escalation_chain (
  id BIGSERIAL PRIMARY KEY,
  grievance_id BIGINT NOT NULL,
  escalated_from_role_id BIGINT,
  escalated_to_role_id BIGINT,
  escalation_reason VARCHAR(500),
  escalation_trigger VARCHAR(100), -- deadline_exceeded, complexity, appeal, jurisdictional
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  resolution_notes TEXT
);

CREATE TABLE delegations (
  id BIGSERIAL PRIMARY KEY,
  grievance_id BIGINT NOT NULL,
  delegated_by_role_id BIGINT,
  delegated_to_role_id BIGINT,
  delegation_reason VARCHAR(500),
  deadline TIMESTAMP,
  completed_at TIMESTAMP,
  completion_notes TEXT,
  performance_rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Real-World Example Workflow

### Scenario: Pothole Reported in District A

1. **Citizen Files Grievance**
   - Files through citizen portal
   - System auto-creates in database
   - Assigned to District A District Magistrate

2. **District Magistrate Reviews (Day 1)**
   - Reviews grievance details
   - Assigns to Deputy DM responsible for that ward
   - Sets 7-day deadline for resolution

3. **Deputy DM Deploys Team (Day 1-2)**
   - Assigns work to Municipal Corporation Roads Authority
   - Specifies work team and timeline
   - Tracks resource allocation

4. **Department Authority Executes (Day 2-5)**
   - Assigns to field worker team
   - Team completes repair work
   - Takes before/after photos
   - Updates status in real-time

5. **Verification & Closure (Day 5-6)**
   - Deputy DM verifies completion
   - Citizen confirms satisfaction
   - System closes grievance
   - Triggers civic points reward

6. **Performance Tracking (Ongoing)**
   - DM sees completion within deadline
   - Mayor's dashboard shows positive resolution
   - Department Authority's performance rating increases
   - Citizen recognition in civic leaderboard if high quality

### If Deadline at Risk (Day 6, Not Completed)

1. **Automatic Escalation Triggered**
   - System detects deadline approaching (1 day remaining)
   - Auto-escalates from Department Authority to DM
   - Sends alert to District Magistrate

2. **District Magistrate Intervention**
   - Reviews progress
   - Can allocate additional resources
   - Can override with direct orders
   - Sets new deadline with accountability

3. **If Still Not Met by Day 7**
   - Auto-escalates to Mayor
   - Mayor can intervene city-wide
   - Can reassign to different department
   - Can accelerate resources

---

## Implementation Features

### Chief Minister Dashboard
- City-wide overview with district performance comparison
- Escalation queue showing critical issues
- Delegation history and outcomes
- Strategic KPIs and trends
- Policy impact monitoring

### Mayor Dashboard
- City-level grievances with ward filters
- District performance within city
- Escalation to self for review
- Budget and resource allocation
- Service delivery scorecard

### District Magistrate Dashboard
- All district grievances with timeline
- Work order assignment interface
- Escalation/Delegation options
- Team performance metrics
- Deadline enforcement tools

### Deputy DM Dashboard
- Ward-specific grievances
- Work team assignments
- Daily progress tracking
- Issue escalation to DM
- Field team performance

### Department Authority Dashboard
- Assigned work orders only
- Field worker task tracking
- Progress documentation
- Real-time status updates
- Resource request form

---

## Key Features Summary

✓ **Hierarchical Access Control:** Each role sees only their jurisdiction  
✓ **Automatic Escalation:** Deadline triggers escalate automatically  
✓ **Manual Override:** Higher levels can intervene directly  
✓ **Complete Transparency:** Full audit trail of every action  
✓ **Performance Tracking:** Metrics by role, department, and jurisdiction  
✓ **Accountability:** Nobody can hide delays or poor performance  
✓ **Real-Time Updates:** Citizens see live progress of their grievances  
✓ **Citizen Recognition:** Contributing citizens featured and rewarded  
✓ **Proof-of-Work:** Demands verified solutions, not just completion  
✓ **Democratic Governance:** Citizens hold administration accountable

---

## Configuration & Customization

The hierarchy can be customized for different city structures:

- **For Large Metropolitan:** Chief Minister → Mayors → DMs → DDMs → Departments
- **For Mid-Size City:** Mayor → District Magistrate → DDM → Departments
- **For Small Town:** Mayor → Department Heads → Field Teams

The system is flexible to accommodate various administrative structures while maintaining the core principles of jurisdiction-based access and hierarchical accountability.
