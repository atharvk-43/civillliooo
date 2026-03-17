// Mock data for development and demo purposes
// Replace with real API calls in production

export const mockChartData = {
  cityManagement: [
    { month: "Jan", projects: 45, budget: 85000, completion: 72 },
    { month: "Feb", projects: 52, budget: 92000, completion: 78 },
    { month: "Mar", projects: 48, budget: 88000, completion: 81 },
    { month: "Apr", projects: 61, budget: 105000, completion: 85 },
    { month: "May", projects: 55, budget: 97000, completion: 88 },
    { month: "Jun", projects: 67, budget: 118000, completion: 91 },
  ],
  traffic: [
    { time: "00:00", congestion: 15, vehicles: 1200, avgSpeed: 45 },
    { time: "06:00", congestion: 35, vehicles: 3400, avgSpeed: 32 },
    { time: "09:00", congestion: 78, vehicles: 7200, avgSpeed: 18 },
    { time: "12:00", congestion: 55, vehicles: 5100, avgSpeed: 28 },
    { time: "15:00", congestion: 65, vehicles: 6800, avgSpeed: 22 },
    { time: "18:00", congestion: 82, vehicles: 8900, avgSpeed: 15 },
    { time: "21:00", congestion: 48, vehicles: 4600, avgSpeed: 35 },
  ],
}

export const mockAlerts = {
  critical: [
    {
      id: "CRIT001",
      title: "Critical Infrastructure Alert",
      description: "System requires immediate attention",
      timestamp: new Date(),
    },
  ],
  warning: [
    {
      id: "WARN001",
      title: "Warning Alert",
      description: "Action recommended",
      timestamp: new Date(),
    },
  ],
}
