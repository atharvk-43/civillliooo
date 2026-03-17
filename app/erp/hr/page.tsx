"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, Plus, Users } from "lucide-react"

// Mock employee data
const employeesData = [
  {
    id: 1,
    employeeId: "EMP-001",
    firstName: "Arjun",
    lastName: "Sharma",
    email: "arjun.sharma@indorecity.gov",
    phone: "+91 731-2345678",
    department: "Transportation",
    jobTitle: "Fleet Manager",
    salary: 1850000,
    hireDate: "2019-03-15",
    status: "active",
    managerName: "Rajesh Kumar",
    skills: "Fleet management, Logistics, Equipment operation",
    availabilityStatus: "available",
  },
  {
    id: 2,
    employeeId: "EMP-002",
    firstName: "Priya",
    lastName: "Verma",
    email: "priya.verma@indorecity.gov",
    phone: "+91 731-3456789",
    department: "Utilities",
    jobTitle: "Water Treatment Technician",
    salary: 1560000,
    hireDate: "2020-06-20",
    status: "active",
    managerName: "Neha Patel",
    skills: "Water treatment, Chemical handling, Equipment maintenance",
    availabilityStatus: "available",
  },
  {
    id: 3,
    employeeId: "EMP-003",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@indorecity.gov",
    phone: "+91 731-4567890",
    department: "Infrastructure",
    jobTitle: "Infrastructure Manager",
    salary: 2060000,
    hireDate: "2018-01-10",
    status: "active",
    managerName: "Vikram Singh",
    skills: "Project management, Civil engineering, Budget management",
    availabilityStatus: "on_assignment",
  },
  {
    id: 4,
    employeeId: "EMP-004",
    firstName: "Anjali",
    lastName: "Singh",
    email: "anjali.singh@indorecity.gov",
    phone: "+91 731-5678901",
    department: "Sanitation",
    jobTitle: "Route Supervisor",
    salary: 1480000,
    hireDate: "2021-02-14",
    status: "active",
    managerName: "Arjun Sharma",
    skills: "Route planning, Team supervision, Customer service",
    availabilityStatus: "available",
  },
  {
    id: 5,
    employeeId: "EMP-005",
    firstName: "Ravi",
    lastName: "Patel",
    email: "ravi.patel@indorecity.gov",
    phone: "+91 731-6789012",
    department: "Transportation",
    jobTitle: "Traffic Operations Technician",
    salary: 1350000,
    hireDate: "2022-05-01",
    status: "on_leave",
    managerName: "Arjun Sharma",
    skills: "Traffic management, Signal systems, Data analysis",
    availabilityStatus: "on_leave",
  },
]

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  on_leave: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
}

const availabilityColors: Record<string, string> = {
  available: "bg-blue-100 text-blue-800",
  on_assignment: "bg-cyan-100 text-cyan-800",
  on_leave: "bg-yellow-100 text-yellow-800",
}

export default function HRPage() {
  const [filters, setFilters] = useState({
    department: "all",
    status: "all",
  })

  const filteredEmployees = employeesData.filter((emp) => {
    if (filters.department !== "all" && emp.department !== filters.department) return false
    if (filters.status !== "all" && emp.status !== filters.status) return false
    return true
  })

  const stats = {
    total: employeesData.length,
    active: employeesData.filter((e) => e.status === "active").length,
    onLeave: employeesData.filter((e) => e.status === "on_leave").length,
    available: employeesData.filter((e) => e.availabilityStatus === "available").length,
  }

  const departmentStats = {
    Transportation: employeesData.filter((e) => e.department === "Transportation").length,
    Utilities: employeesData.filter((e) => e.department === "Utilities").length,
    Infrastructure: employeesData.filter((e) => e.department === "Infrastructure").length,
    Sanitation: employeesData.filter((e) => e.department === "Sanitation").length,
  }

  return (
    <>
      <AppHeader />
      <PageContainer title="HR & Workforce Management" description="Manage employees, assignments, and team deployment">
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Employees</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active Staff</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.available}</div>
                <div className="text-sm text-muted-foreground">Available for Assignment</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-600">{stats.onLeave}</div>
                <div className="text-sm text-muted-foreground">On Leave</div>
              </CardContent>
            </Card>
          </div>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Employees by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(departmentStats).map(([dept, count]) => (
                  <div key={dept} className="border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">{dept}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
              >
                <option value="all">All Departments</option>
                <option value="Transportation">Transportation</option>
                <option value="Utilities">Utilities</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Sanitation">Sanitation</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
            <Link href="/erp/hr/new-employee">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </Link>
          </div>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <Link key={employee.id} href={`/erp/hr/${employee.id}`}>
                    <div className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {employee.employeeId}: {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{employee.jobTitle}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={statusColors[employee.status]}>{employee.status.replace("_", " ")}</Badge>
                          <Badge className={availabilityColors[employee.availabilityStatus]}>
                            {employee.availabilityStatus === "available"
                              ? "Available"
                              : employee.availabilityStatus === "on_assignment"
                                ? "On Assignment"
                                : "On Leave"}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-muted-foreground">Department</div>
                          <div className="font-medium">{employee.department}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Email</div>
                          <div className="font-medium text-blue-600 text-xs">{employee.email}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Hire Date</div>
                          <div className="font-medium">{new Date(employee.hireDate).toLocaleDateString("en-IN")}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Salary</div>
                          <div className="font-medium">₹{(employee.salary / 100000).toFixed(2)}L/yr</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Reports To</div>
                          <div className="font-medium">{employee.managerName}</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          Skills: {employee.skills}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
