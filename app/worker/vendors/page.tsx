"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Star, Phone, Mail, MapPin } from "lucide-react"

interface Vendor {
  id: number
  vendor_code: string
  vendor_name: string
  contact_person: string
  email: string
  phone: string
  address: string
  category: string
  status: "active" | "inactive"
  rating: number
  total_spent: number
}

interface Worker {
  id: number
  name: string
  email: string
  phone: string
  role: string
  zone: string
  status: "available" | "busy" | "inactive"
  rating: number
  tasksCompleted: number
}

export default function VendorManagement() {
  const { role } = useRouter()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("vendors")
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])

  useEffect(() => {
    if (role !== "citizen-leader") {
      router.push("/login")
      return
    }
    fetchData()
  }, [role, router])

  const fetchData = async () => {
    const mockVendors: Vendor[] = [
      {
        id: 1,
        vendor_code: "VND-001",
        vendor_name: "ABC Construction & Maintenance",
        contact_person: "Rajesh Kumar",
        email: "rajesh@abcmaintenance.com",
        phone: "+91-98765-43210",
        address: "123 Industrial Park, Indore",
        category: "maintenance",
        status: "active",
        rating: 4.8,
        total_spent: 250000,
      },
      {
        id: 2,
        vendor_code: "VND-002",
        vendor_name: "XYZ Infrastructure Services",
        contact_person: "Priya Singh",
        email: "priya@xyzinfra.com",
        phone: "+91-98765-43211",
        address: "456 Commercial Hub, Indore",
        category: "services",
        status: "active",
        rating: 4.5,
        total_spent: 180000,
      },
      {
        id: 3,
        vendor_code: "VND-003",
        vendor_name: "Urban Solutions Ltd",
        contact_person: "Amit Patel",
        email: "amit@urbansolutions.com",
        phone: "+91-98765-43212",
        address: "789 Tech Plaza, Indore",
        category: "maintenance",
        status: "active",
        rating: 4.9,
        total_spent: 320000,
      },
      {
        id: 4,
        vendor_code: "VND-004",
        vendor_name: "City Works Co.",
        contact_person: "Vikram Sharma",
        email: "vikram@cityworks.com",
        phone: "+91-98765-43213",
        address: "321 Business District, Indore",
        category: "services",
        status: "active",
        rating: 4.3,
        total_spent: 150000,
      },
    ]

    const mockWorkers: Worker[] = [
      {
        id: 1,
        name: "Suresh Kumar",
        email: "suresh.kumar@abc.com",
        phone: "+91-98765-54321",
        role: "Senior Technician",
        zone: "Vijay Nagar",
        status: "busy",
        rating: 4.7,
        tasksCompleted: 45,
      },
      {
        id: 2,
        name: "Kavya Reddy",
        email: "kavya.reddy@xyz.com",
        phone: "+91-98765-54322",
        role: "Field Supervisor",
        zone: "Navlakha",
        status: "available",
        rating: 4.8,
        tasksCompleted: 52,
      },
      {
        id: 3,
        name: "Ramesh Gupta",
        email: "ramesh.gupta@urban.com",
        phone: "+91-98765-54323",
        role: "Maintenance Specialist",
        zone: "Super Corridor",
        status: "available",
        rating: 4.9,
        tasksCompleted: 68,
      },
      {
        id: 4,
        name: "Neha Joshi",
        email: "neha.joshi@city.com",
        phone: "+91-98765-54324",
        role: "Inspector",
        zone: "Palasia",
        status: "busy",
        rating: 4.6,
        tasksCompleted: 38,
      },
    ]

    setVendors(mockVendors)
    setWorkers(mockWorkers)
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.zone.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => router.back()} variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Vendors & Workers</h1>
              <p className="text-muted-foreground mt-1">Manage your network of service providers</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Search vendors or workers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="vendors">Vendors ({vendors.length})</TabsTrigger>
            <TabsTrigger value="workers">Workers ({workers.length})</TabsTrigger>
          </TabsList>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-4">
            {filteredVendors.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No vendors found matching your search</p>
              </Card>
            ) : (
              filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{vendor.vendor_name}</h3>
                        <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
                          {vendor.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vendor.vendor_code}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-foreground">{vendor.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  <p className="text-foreground mb-4">{vendor.category}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Phone size={18} className="text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium text-foreground">{vendor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail size={18} className="text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium text-foreground">{vendor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium text-foreground">{vendor.address}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="text-sm font-medium text-foreground">₹{vendor.total_spent.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-4">
            {filteredWorkers.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No workers found matching your search</p>
              </Card>
            ) : (
              filteredWorkers.map((worker) => (
                <Card key={worker.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{worker.name}</h3>
                        <Badge
                          variant={
                            worker.status === "available"
                              ? "default"
                              : worker.status === "busy"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {worker.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{worker.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-foreground">{worker.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Phone size={18} className="text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium text-foreground">{worker.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail size={18} className="text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium text-foreground">{worker.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Zone</p>
                        <p className="text-sm font-medium text-foreground">{worker.zone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tasks Completed</p>
                      <p className="text-sm font-medium text-foreground">{worker.tasksCompleted}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    View History
                  </Button>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
