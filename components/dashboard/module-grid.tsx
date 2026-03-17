"use client"

import Link from "next/link"
import {
  Building2,
  Zap,
  Trash2,
  Users,
  AlertTriangle,
  Leaf,
  Navigation,
  Briefcase,
  DollarSign,
  Wrench,
  ShoppingCart,
  FileText,
} from "lucide-react"

const modules = [
  {
    id: "city-management",
    title: "City Management",
    description: "Municipal operations, budgets, and governance",
    icon: Building2,
    color: "from-blue-600 to-blue-700",
    href: "/modules/city-management",
    metrics: { value: "847", label: "Active Projects" },
    category: "analytics",
  },
  {
    id: "traffic-mobility",
    title: "Traffic & Mobility",
    description: "Real-time traffic, public transport, and road networks",
    icon: Navigation,
    color: "from-cyan-600 to-cyan-700",
    href: "/modules/traffic-mobility",
    metrics: { value: "2,483", label: "Vehicles Tracked" },
    category: "analytics",
  },
  {
    id: "energy-utilities",
    title: "Energy & Utilities",
    description: "Power grid, water distribution, and utility management",
    icon: Zap,
    color: "from-amber-600 to-amber-700",
    href: "/modules/energy-utilities",
    metrics: { value: "94.2%", label: "Grid Efficiency" },
    category: "analytics",
  },
  {
    id: "waste-management",
    title: "Waste Management",
    description: "Waste collection, recycling, and environmental compliance",
    icon: Trash2,
    color: "from-green-600 to-green-700",
    href: "/modules/waste-management",
    metrics: { value: "156T", label: "Collected Daily" },
    category: "analytics",
  },
  {
    id: "citizen-services",
    title: "Citizen Services",
    description: "Public services, permits, licenses, and grievances",
    icon: Users,
    color: "from-purple-600 to-purple-700",
    href: "/modules/citizen-services",
    metrics: { value: "12,847", label: "Active Users" },
    category: "analytics",
  },
  {
    id: "risk-emergency",
    title: "Risk & Emergency Response",
    description: "Emergency management, disaster response, and public safety",
    icon: AlertTriangle,
    color: "from-red-600 to-red-700",
    href: "/modules/risk-emergency",
    metrics: { value: "100%", label: "Coverage" },
    category: "analytics",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    description: "Environmental metrics, carbon footprint, and green initiatives",
    icon: Leaf,
    color: "from-emerald-600 to-emerald-700",
    href: "/modules/sustainability",
    metrics: { value: "-23%", label: "Emissions (YoY)" },
    category: "analytics",
  },
  {
    id: "work-orders",
    title: "Work Orders & Tasks",
    description: "Create, assign, and track operational tasks and maintenance",
    icon: Briefcase,
    color: "from-indigo-600 to-indigo-700",
    href: "/erp/work-orders",
    metrics: { value: "24", label: "Active Orders" },
    category: "execution",
  },
  {
    id: "financial",
    title: "Financial Management",
    description: "Monitor budgets, expenditures, and financial performance",
    icon: DollarSign,
    color: "from-green-600 to-green-700",
    href: "/erp/financial",
    metrics: { value: "$10.2M", label: "Total Budget" },
    category: "execution",
  },
  {
    id: "assets",
    title: "Asset & Maintenance",
    description: "Track equipment, vehicles, and preventive maintenance schedules",
    icon: Wrench,
    color: "from-orange-600 to-orange-700",
    href: "/erp/assets",
    metrics: { value: "156", label: "Total Assets" },
    category: "execution",
  },
  {
    id: "procurement",
    title: "Procurement & Vendors",
    description: "Manage purchase orders and vendor relationships",
    icon: ShoppingCart,
    color: "from-pink-600 to-pink-700",
    href: "/erp/procurement",
    metrics: { value: "$46.5k", label: "PO Value" },
    category: "execution",
  },
  {
    id: "hr",
    title: "HR & Workforce",
    description: "Manage employees, assignments, and team deployment",
    icon: Users,
    color: "from-teal-600 to-teal-700",
    href: "/erp/hr",
    metrics: { value: "487", label: "Employees" },
    category: "execution",
  },
  {
    id: "permits",
    title: "Permits & Licensing",
    description: "Manage citizen permits, business licenses, and compliance",
    icon: FileText,
    color: "from-cyan-600 to-cyan-700",
    href: "/erp/permits",
    metrics: { value: "142", label: "Active Permits" },
    category: "execution",
  },
]

export function ModuleGrid() {
  const analyticsModules = modules.filter((m) => m.category === "analytics")
  const executionModules = modules.filter((m) => m.category === "execution")

  return (
    <div className="space-y-8">
      {/* Analytics Dashboards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Monitoring & Analytics</h2>
        <p className="text-muted-foreground mb-6">Real-time monitoring of city services and infrastructure</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsModules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.id} href={module.href}>
                <div className="module-card group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-br ${module.color} p-2.5 flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      OPEN →
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">{module.description}</p>

                  <div className="pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{module.metrics.value}</p>
                      <p className="text-xs text-muted-foreground">{module.metrics.label}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ERP Execution Modules */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">ERP Execution & Operations</h2>
        <p className="text-muted-foreground mb-6">Manage workflows, assets, budgets, and governance across the city</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executionModules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.id} href={module.href}>
                <div className="module-card group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-br ${module.color} p-2.5 flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      OPEN →
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">{module.description}</p>

                  <div className="pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{module.metrics.value}</p>
                      <p className="text-xs text-muted-foreground">{module.metrics.label}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
