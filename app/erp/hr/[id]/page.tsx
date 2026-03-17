"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const employeesData = [
  {
    id: 1,
    employeeId: "EMP-001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@city.gov",
    phone: "(555) 123-4567",
    department: "Transportation",
    jobTitle: "Fleet Manager",
    salary: 85000,
    hireDate: "2019-03-15",
    status: "active",
    managerName: "Michael Davis",
    skills: "Fleet management, Logistics, Equipment operation",
    availabilityStatus: "available",
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

export default function EmployeeDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const employee = employeesData.find((e) => e.id === id)

  if (!employee) {
    return (
      <>
        <AppHeader />
        <PageContainer title="Employee Not Found">
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <p>The requested employee could not be found.</p>
            </CardContent>
          </Card>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <PageContainer title={employee.employeeId}>
        <div className="space-y-6">
          <Link href="/erp/hr">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to HR
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>
                    {employee.firstName} {employee.lastName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{employee.jobTitle}</p>
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
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-semibold">{employee.department}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold text-blue-600 text-sm">{employee.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-semibold">{employee.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Hire Date</div>
                  <div className="font-semibold">{new Date(employee.hireDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Compensation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Annual Salary</div>
                    <div className="font-semibold text-lg">${(employee.salary / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Reports To</div>
                    <div className="font-semibold">{employee.managerName}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Skills & Qualifications</h3>
                <p className="text-sm text-muted-foreground">{employee.skills}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Assign to Work Order</Button>
                <Button variant="outline">Edit Employee</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
