"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Plus, Filter } from "lucide-react"

// Mock budget data
const budgetData = [
  {
    id: 1,
    code: "TRN-001",
    fiscalYear: 2024,
    department: "Transportation",
    category: "Operations",
    allocated: 2500000,
    spent: 1850000,
    committed: 200000,
    status: "active",
  },
  {
    id: 2,
    code: "UTL-001",
    fiscalYear: 2024,
    department: "Utilities",
    category: "Maintenance",
    allocated: 1800000,
    spent: 950000,
    committed: 300000,
    status: "active",
  },
  {
    id: 3,
    code: "SAN-001",
    fiscalYear: 2024,
    department: "Sanitation",
    category: "Operations",
    allocated: 1200000,
    spent: 680000,
    committed: 150000,
    status: "active",
  },
  {
    id: 4,
    code: "INF-001",
    fiscalYear: 2024,
    department: "Infrastructure",
    category: "Capital",
    allocated: 3500000,
    spent: 2100000,
    committed: 800000,
    status: "active",
  },
]

const expendituresTrendData = [
  { month: "Jan", amount: 450000 },
  { month: "Feb", amount: 520000 },
  { month: "Mar", amount: 610000 },
  { month: "Apr", amount: 580000 },
  { month: "May", amount: 720000 },
  { month: "Jun", amount: 890000 },
]

const departmentSpendingData = [
  { name: "Transportation", value: 1850000 },
  { name: "Utilities", value: 950000 },
  { name: "Sanitation", value: 680000 },
  { name: "Infrastructure", value: 2100000 },
]

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#ef4444"]

export default function FinancialPage() {
  const [filters, setFilters] = useState({
    department: "all",
    fiscalYear: "2024",
  })

  const filteredBudgets = budgetData.filter((b) => {
    if (filters.department !== "all" && b.department !== filters.department) return false
    if (b.fiscalYear !== Number.parseInt(filters.fiscalYear)) return false
    return true
  })

  const totalAllocated = filteredBudgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0)
  const totalCommitted = filteredBudgets.reduce((sum, b) => sum + b.committed, 0)
  const totalAvailable = totalAllocated - totalSpent - totalCommitted
  const budgetUtilization = ((totalSpent / totalAllocated) * 100).toFixed(1)

  return (
    <>
      <AppHeader />
      <PageContainer
        title="Financial Management & Budgeting"
        description="Monitor departmental budgets, expenditures, and financial performance"
      >
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Total Allocated</div>
                <div className="text-3xl font-bold">${(totalAllocated / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground mt-2">FY 2024</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
                <div className="text-3xl font-bold">${(totalSpent / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground mt-2">{budgetUtilization}% utilization</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Committed</div>
                <div className="text-3xl font-bold">${(totalCommitted / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground mt-2">Pending orders</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <CardContent className="pt-6">
                <div className="text-sm text-green-700 dark:text-green-300 mb-1">Available</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${(totalAvailable / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 mt-2">Remaining budget</div>
              </CardContent>
            </Card>
          </div>

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
                <option value="Sanitation">Sanitation</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
            <Link href="/erp/financial/new-budget">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Budget
              </Button>
            </Link>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expenditures Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Expenditure Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={expendituresTrendData}>
                    <defs>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="rgb(99, 102, 241)"
                      fillOpacity={1}
                      fill="url(#colorExp)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Spending */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Spending by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentSpendingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentSpendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Department Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBudgets.map((budget) => {
                  const spent = budget.spent
                  const allocated = budget.allocated
                  const utilized = ((spent / allocated) * 100).toFixed(1)

                  return (
                    <div
                      key={budget.id}
                      className="border border-border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {budget.code}: {budget.department}
                          </h3>
                          <p className="text-sm text-muted-foreground">{budget.category}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{utilized}% Used</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Allocated</div>
                          <div className="font-semibold">${(allocated / 1000000).toFixed(1)}M</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Spent</div>
                          <div className="font-semibold text-blue-600">${(spent / 1000000).toFixed(1)}M</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Committed</div>
                          <div className="font-semibold text-yellow-600">
                            ${(budget.committed / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Available</div>
                          <div className="font-semibold text-green-600">
                            ${((allocated - spent - budget.committed) / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${Math.min(Number.parseFloat(utilized), 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
