"use client"
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Search, Loader2 } from "lucide-react"

interface ZoneData {
  name: string
  coords: [number, number][]
  status: "critical" | "warning" | "good"
  metrics: {
    congestion?: number
    wasteCollection?: number
    powerOutages?: number
    waterQuality?: number
    grievanceResolution?: number
    emergencyResponse?: number
  }
  description: string
  issues: string[]
}

interface SearchResult {
  lat: number
  lon: number
  display_name: string
  marker?: L.Marker
}

// Fix Leaflet default icon issue
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  })
}

const MapComponent = () => {
  const [map, setMap] = useState<L.Map | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searchedMarkers, setSearchedMarkers] = useState<L.Marker[]>([])

  const searchLocality = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Search with Nominatim API (OpenStreetMap), biased towards India
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=10`,
        {
          headers: {
            "User-Agent": "Civilio",
          },
        }
      )

      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      const results = data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name,
      }))

      setSearchResults(results)
      setShowResults(true)
    } catch (error) {
      console.error("Geocoding error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const pinLocation = (result: SearchResult) => {
    if (!map) return

    // Remove existing search markers
    searchedMarkers.forEach((marker) => marker.remove())
    setSearchedMarkers([])

    // Create custom search marker (different color from zone center)
    const searchMarker = L.marker([result.lat, result.lon], {
      icon: L.icon({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    })
      .addTo(map)
      .bindPopup(
        `<div class="font-semibold text-sm">${result.display_name}</div><div class="text-xs text-gray-600 mt-1">Searched Location</div>`
      )
      .openPopup()

    // Zoom to location
    map.setView([result.lat, result.lon], 15)
    setSearchedMarkers([searchMarker])
    setShowResults(false)
    setSearchQuery("")
  }

  const clearSearch = () => {
    searchedMarkers.forEach((marker) => marker.remove())
    setSearchedMarkers([])
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    // Initialize map centered on India
    const mapInstance = L.map("india-map", {
      center: [23.1815, 79.9864],
      zoom: 4,
      maxBounds: [
        [6.2, 68.1],
        [35.2, 97.4],
      ],
      maxBoundsViscosity: 1.0,
    })

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(mapInstance)

    // Define zones across major Indian cities
    const allZones: ZoneData[] = [
      // INDORE ZONES
      {
        name: "Vijay Nagar, Indore",
        coords: [
          [22.7349, 75.8726],
          [22.732, 75.881],
          [22.741, 75.884],
          [22.744, 75.8756],
        ],
        status: "critical",
        metrics: {
          congestion: 82,
          wasteCollection: 45,
          powerOutages: 8,
          waterQuality: 35,
          grievanceResolution: 52,
          emergencyResponse: 4.2,
        },
        description: "Critical Zone - High priority intervention needed",
        issues: [
          "Traffic congestion at 82% during peak hours",
          "Waste collection efficiency only 45%",
          "Multiple power outages reported (8 incidents/month)",
          "Water quality index below standard",
          "Grievance resolution rate 52%",
          "Emergency response time: 4.2 minutes",
        ],
      },
      {
        name: "Navlakha, Indore",
        coords: [
          [22.7265, 75.8457],
          [22.7235, 75.8541],
          [22.7325, 75.8571],
          [22.7355, 75.8487],
        ],
        status: "warning",
        metrics: {
          congestion: 58,
          wasteCollection: 68,
          powerOutages: 3,
          waterQuality: 72,
          grievanceResolution: 75,
          emergencyResponse: 3.1,
        },
        description: "Warning Zone - Monitoring required",
        issues: [
          "Moderate traffic congestion at 58%",
          "Waste collection efficiency at 68%",
          "Occasional power disruptions (3 incidents/month)",
          "Water quality acceptable but needs monitoring",
          "Grievance resolution rate: 75%",
          "Emergency response time: 3.1 minutes",
        ],
      },
      {
        name: "Azad Nagar, Indore",
        coords: [
          [22.7151, 75.862],
          [22.7121, 75.8704],
          [22.7211, 75.8734],
          [22.7241, 75.865],
        ],
        status: "good",
        metrics: {
          congestion: 35,
          wasteCollection: 92,
          powerOutages: 1,
          waterQuality: 88,
          grievanceResolution: 88,
          emergencyResponse: 2.5,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 35%",
          "Excellent waste collection efficiency at 92%",
          "Minimal power disruptions (1 incident/month)",
          "Water quality index above standard at 88%",
          "Grievance resolution rate: 88%",
          "Emergency response time: 2.5 minutes",
        ],
      },
      {
        name: "Malviya Nagar, Indore",
        coords: [
          [22.7438, 75.8579],
          [22.7408, 75.8663],
          [22.7498, 75.8693],
          [22.7528, 75.8609],
        ],
        status: "warning",
        metrics: {
          congestion: 62,
          wasteCollection: 71,
          powerOutages: 4,
          waterQuality: 70,
          grievanceResolution: 72,
          emergencyResponse: 3.3,
        },
        description: "Warning Zone - Monitoring required",
        issues: [
          "Moderate-high traffic congestion at 62%",
          "Waste collection efficiency at 71%",
          "Some power disruptions (4 incidents/month)",
          "Water quality stable at 70%",
          "Grievance resolution rate: 72%",
          "Emergency response time: 3.3 minutes",
        ],
      },
      {
        name: "Palasia, Indore",
        coords: [
          [22.7192, 75.8356],
          [22.7162, 75.844],
          [22.7252, 75.847],
          [22.7282, 75.8386],
        ],
        status: "good",
        metrics: {
          congestion: 40,
          wasteCollection: 89,
          powerOutages: 2,
          waterQuality: 85,
          grievanceResolution: 86,
          emergencyResponse: 2.7,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 40%",
          "Good waste collection efficiency at 89%",
          "Rare power disruptions (2 incidents/month)",
          "Water quality above standard at 85%",
          "Grievance resolution rate: 86%",
          "Emergency response time: 2.7 minutes",
        ],
      },
      {
        name: "Super Corridor, Indore",
        coords: [
          [22.7546, 75.8645],
          [22.7516, 75.8729],
          [22.7606, 75.8759],
          [22.7636, 75.8675],
        ],
        status: "critical",
        metrics: {
          congestion: 88,
          wasteCollection: 42,
          powerOutages: 10,
          waterQuality: 38,
          grievanceResolution: 48,
          emergencyResponse: 4.5,
        },
        description: "Critical Zone - High priority intervention needed",
        issues: [
          "Severe traffic congestion at 88% peak hours",
          "Poor waste collection efficiency at 42%",
          "Frequent power outages (10 incidents/month)",
          "Water quality below standard at 38%",
          "Grievance resolution rate: 48%",
          "Emergency response time: 4.5 minutes",
        ],
      },
      {
        name: "Rau, Indore",
        coords: [
          [22.7058, 75.8501],
          [22.7028, 75.8585],
          [22.7118, 75.8615],
          [22.7148, 75.8531],
        ],
        status: "good",
        metrics: {
          congestion: 38,
          wasteCollection: 90,
          powerOutages: 1,
          waterQuality: 87,
          grievanceResolution: 87,
          emergencyResponse: 2.6,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 38%",
          "Excellent waste collection efficiency at 90%",
          "Minimal power disruptions (1 incident/month)",
          "Water quality above standard at 87%",
          "Grievance resolution rate: 87%",
          "Emergency response time: 2.6 minutes",
        ],
      },
      {
        name: "Nipania, Indore",
        coords: [
          [22.6965, 75.8731],
          [22.6935, 75.8815],
          [22.7025, 75.8845],
          [22.7055, 75.8761],
        ],
        status: "warning",
        metrics: {
          congestion: 55,
          wasteCollection: 70,
          powerOutages: 3,
          waterQuality: 74,
          grievanceResolution: 76,
          emergencyResponse: 3.0,
        },
        description: "Warning Zone - Monitoring required",
        issues: [
          "Moderate traffic congestion at 55%",
          "Waste collection efficiency at 70%",
          "Occasional power disruptions (3 incidents/month)",
          "Water quality acceptable at 74%",
          "Grievance resolution rate: 76%",
          "Emergency response time: 3.0 minutes",
        ],
      },
      // DELHI ZONES
      {
        name: "Central Delhi",
        coords: [
          [28.6329, 77.2195],
          [28.6299, 77.2279],
          [28.6389, 77.2309],
          [28.6419, 77.2225],
        ],
        status: "critical",
        metrics: {
          congestion: 85,
          wasteCollection: 48,
          powerOutages: 9,
          waterQuality: 32,
          grievanceResolution: 50,
          emergencyResponse: 4.3,
        },
        description: "Critical Zone - High priority intervention needed",
        issues: [
          "Severe traffic congestion at 85% peak hours",
          "Waste collection efficiency only 48%",
          "Frequent power outages (9 incidents/month)",
          "Water quality below standard",
          "Grievance resolution rate 50%",
          "Emergency response time: 4.3 minutes",
        ],
      },
      {
        name: "East Delhi",
        coords: [
          [28.5829, 77.2795],
          [28.5799, 77.2879],
          [28.5889, 77.2909],
          [28.5919, 77.2825],
        ],
        status: "good",
        metrics: {
          congestion: 42,
          wasteCollection: 88,
          powerOutages: 2,
          waterQuality: 84,
          grievanceResolution: 85,
          emergencyResponse: 2.8,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 42%",
          "Good waste collection efficiency at 88%",
          "Minimal power disruptions (2 incidents/month)",
          "Water quality above standard at 84%",
          "Grievance resolution rate: 85%",
          "Emergency response time: 2.8 minutes",
        ],
      },
      {
        name: "South Delhi",
        coords: [
          [28.5329, 77.1895],
          [28.5299, 77.1979],
          [28.5389, 77.2009],
          [28.5419, 77.1925],
        ],
        status: "warning",
        metrics: {
          congestion: 60,
          wasteCollection: 70,
          powerOutages: 4,
          waterQuality: 73,
          grievanceResolution: 74,
          emergencyResponse: 3.2,
        },
        description: "Warning Zone - Monitoring required",
        issues: [
          "Moderate traffic congestion at 60%",
          "Waste collection efficiency at 70%",
          "Occasional power disruptions (4 incidents/month)",
          "Water quality acceptable at 73%",
          "Grievance resolution rate: 74%",
          "Emergency response time: 3.2 minutes",
        ],
      },
      // MUMBAI ZONES
      {
        name: "Central Mumbai",
        coords: [
          [19.0760, 72.8777],
          [19.0730, 72.8861],
          [19.0820, 72.8891],
          [19.0850, 72.8807],
        ],
        status: "critical",
        metrics: {
          congestion: 87,
          wasteCollection: 46,
          powerOutages: 11,
          waterQuality: 30,
          grievanceResolution: 49,
          emergencyResponse: 4.4,
        },
        description: "Critical Zone - High priority intervention needed",
        issues: [
          "Severe traffic congestion at 87% peak hours",
          "Waste collection efficiency only 46%",
          "Frequent power outages (11 incidents/month)",
          "Water quality below standard",
          "Grievance resolution rate 49%",
          "Emergency response time: 4.4 minutes",
        ],
      },
      {
        name: "North Mumbai",
        coords: [
          [19.2183, 72.8397],
          [19.2153, 72.8481],
          [19.2243, 72.8511],
          [19.2273, 72.8427],
        ],
        status: "warning",
        metrics: {
          congestion: 61,
          wasteCollection: 69,
          powerOutages: 5,
          waterQuality: 72,
          grievanceResolution: 73,
          emergencyResponse: 3.3,
        },
        description: "Warning Zone - Monitoring required",
        issues: [
          "Moderate-high traffic congestion at 61%",
          "Waste collection efficiency at 69%",
          "Some power disruptions (5 incidents/month)",
          "Water quality stable at 72%",
          "Grievance resolution rate: 73%",
          "Emergency response time: 3.3 minutes",
        ],
      },
      {
        name: "South Mumbai",
        coords: [
          [18.9676, 72.8194],
          [18.9646, 72.8278],
          [18.9736, 72.8308],
          [18.9766, 72.8224],
        ],
        status: "good",
        metrics: {
          congestion: 39,
          wasteCollection: 91,
          powerOutages: 1,
          waterQuality: 89,
          grievanceResolution: 89,
          emergencyResponse: 2.4,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 39%",
          "Excellent waste collection efficiency at 91%",
          "Minimal power disruptions (1 incident/month)",
          "Water quality above standard at 89%",
          "Grievance resolution rate: 89%",
          "Emergency response time: 2.4 minutes",
        ],
      },
      // BANGALORE ZONES
      {
        name: "Central Bangalore",
        coords: [
          [12.9716, 77.5946],
          [12.9686, 77.6030],
          [12.9776, 77.6060],
          [12.9806, 77.5976],
        ],
        status: "warning",
        metrics: {
          congestion: 64,
          wasteCollection: 67,
          powerOutages: 6,
          waterQuality: 71,
          grievanceResolution: 71,
          emergencyResponse: 3.4,
        },
        description: "Warning Zone - Monitoring required",
        issues: [
          "Moderate-high traffic congestion at 64%",
          "Waste collection efficiency at 67%",
          "Some power disruptions (6 incidents/month)",
          "Water quality stable at 71%",
          "Grievance resolution rate: 71%",
          "Emergency response time: 3.4 minutes",
        ],
      },
      {
        name: "East Bangalore",
        coords: [
          [12.9816, 77.6546],
          [12.9786, 77.6630],
          [12.9876, 77.6660],
          [12.9906, 77.6576],
        ],
        status: "good",
        metrics: {
          congestion: 41,
          wasteCollection: 87,
          powerOutages: 2,
          waterQuality: 86,
          grievanceResolution: 86,
          emergencyResponse: 2.7,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 41%",
          "Good waste collection efficiency at 87%",
          "Rare power disruptions (2 incidents/month)",
          "Water quality above standard at 86%",
          "Grievance resolution rate: 86%",
          "Emergency response time: 2.7 minutes",
        ],
      },
      {
        name: "West Bangalore",
        coords: [
          [13.0016, 77.4746],
          [12.9986, 77.4830],
          [13.0076, 77.4860],
          [13.0106, 77.4776],
        ],
        status: "critical",
        metrics: {
          congestion: 86,
          wasteCollection: 44,
          powerOutages: 8,
          waterQuality: 37,
          grievanceResolution: 51,
          emergencyResponse: 4.2,
        },
        description: "Critical Zone - High priority intervention needed",
        issues: [
          "Severe traffic congestion at 86% peak hours",
          "Poor waste collection efficiency at 44%",
          "Frequent power outages (8 incidents/month)",
          "Water quality below standard at 37%",
          "Grievance resolution rate: 51%",
          "Emergency response time: 4.2 minutes",
        ],
      },
      // KOLKATA ZONES
      {
        name: "Central Kolkata",
        coords: [
          [22.5726, 88.3639],
          [22.5696, 88.3723],
          [22.5786, 88.3753],
          [22.5816, 88.3669],
        ],
        status: "warning",
        metrics: {
          congestion: 59,
          wasteCollection: 71,
          powerOutages: 3,
          waterQuality: 75,
          grievanceResolution: 75,
          emergencyResponse: 3.0,
        },
        description: "Warning Zone - Monitoring required",
        issues: [
          "Moderate traffic congestion at 59%",
          "Waste collection efficiency at 71%",
          "Occasional power disruptions (3 incidents/month)",
          "Water quality acceptable at 75%",
          "Grievance resolution rate: 75%",
          "Emergency response time: 3.0 minutes",
        ],
      },
      {
        name: "East Kolkata",
        coords: [
          [22.5226, 88.4439],
          [22.5196, 88.4523],
          [22.5286, 88.4553],
          [22.5316, 88.4469],
        ],
        status: "good",
        metrics: {
          congestion: 37,
          wasteCollection: 91,
          powerOutages: 1,
          waterQuality: 87,
          grievanceResolution: 88,
          emergencyResponse: 2.5,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 37%",
          "Excellent waste collection efficiency at 91%",
          "Minimal power disruptions (1 incident/month)",
          "Water quality above standard at 87%",
          "Grievance resolution rate: 88%",
          "Emergency response time: 2.5 minutes",
        ],
      },
      // HYDERABAD ZONES
      {
        name: "Central Hyderabad",
        coords: [
          [17.3850, 78.4867],
          [17.3820, 78.4951],
          [17.3910, 78.4981],
          [17.3940, 78.4897],
        ],
        status: "critical",
        metrics: {
          congestion: 83,
          wasteCollection: 47,
          powerOutages: 7,
          waterQuality: 39,
          grievanceResolution: 53,
          emergencyResponse: 4.1,
        },
        description: "Critical Zone - High priority intervention needed",
        issues: [
          "Severe traffic congestion at 83% peak hours",
          "Waste collection efficiency only 47%",
          "Frequent power outages (7 incidents/month)",
          "Water quality below standard at 39%",
          "Grievance resolution rate: 53%",
          "Emergency response time: 4.1 minutes",
        ],
      },
      {
        name: "Outer Hyderabad",
        coords: [
          [17.4350, 78.5367],
          [17.4320, 78.5451],
          [17.4410, 78.5481],
          [17.4440, 78.5397],
        ],
        status: "good",
        metrics: {
          congestion: 43,
          wasteCollection: 86,
          powerOutages: 2,
          waterQuality: 83,
          grievanceResolution: 84,
          emergencyResponse: 2.9,
        },
        description: "Green Zone - Well managed",
        issues: [
          "Low traffic congestion at 43%",
          "Good waste collection efficiency at 86%",
          "Rare power disruptions (2 incidents/month)",
          "Water quality above standard at 83%",
          "Grievance resolution rate: 84%",
          "Emergency response time: 2.9 minutes",
        ],
      },
    ]

    const colorMap: Record<string, { color: string; label: string }> = {
      critical: { color: "#ef4444", label: "🔴 Critical Issues" },
      warning: { color: "#eab308", label: "🟡 Warning Level" },
      good: { color: "#22c55e", label: "🟢 Good Status" },
    }

    // Render all zones across India
    allZones.forEach((zone) => {
      const polygon = L.polygon(zone.coords as [number, number][], {
        color: colorMap[zone.status].color,
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.5,
        fillColor: colorMap[zone.status].color,
      }).addTo(mapInstance)

      // Enhanced popup with detailed zone information
      const popupContent = `
        <div class="p-3 max-w-xs">
          <div class="font-bold text-sm mb-2">${zone.name}</div>
          <div class="text-xs font-semibold mb-2">${colorMap[zone.status].label}</div>
          <div class="text-xs text-gray-700 mb-3">${zone.description}</div>
          
          <div class="text-xs font-semibold mb-1">Key Metrics:</div>
          <div class="text-xs space-y-1 mb-3 bg-gray-50 p-2 rounded">
            ${zone.metrics.congestion !== undefined ? `<div>🚗 Traffic Congestion: ${zone.metrics.congestion}%</div>` : ""}
            ${zone.metrics.wasteCollection !== undefined ? `<div>♻️ Waste Collection: ${zone.metrics.wasteCollection}%</div>` : ""}
            ${zone.metrics.powerOutages !== undefined ? `<div>⚡ Power Outages: ${zone.metrics.powerOutages}/month</div>` : ""}
            ${zone.metrics.waterQuality !== undefined ? `<div>💧 Water Quality Index: ${zone.metrics.waterQuality}</div>` : ""}
            ${zone.metrics.grievanceResolution !== undefined ? `<div>📋 Grievance Resolution: ${zone.metrics.grievanceResolution}%</div>` : ""}
            ${zone.metrics.emergencyResponse !== undefined ? `<div>🚑 Emergency Response: ${zone.metrics.emergencyResponse} min</div>` : ""}
          </div>
          
          <div class="text-xs font-semibold mb-1">Issues/Status:</div>
          <ul class="text-xs space-y-1 text-gray-700">
            ${zone.issues.map((issue) => `<li>• ${issue}</li>`).join("")}
          </ul>
        </div>
      `

      polygon.bindPopup(popupContent, { maxWidth: 350, maxHeight: 400 })
    })

    // Add city center markers
    const cityMarkers = [
      { name: "Indore", lat: 22.7196, lon: 75.8577 },
      { name: "Delhi", lat: 28.6329, lon: 77.2195 },
      { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
      { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
      { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
      { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
    ]

    cityMarkers.forEach((city) => {
      L.circleMarker([city.lat, city.lon], {
        radius: 8,
        fillColor: "#3b82f6",
        color: "#1e40af",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(mapInstance)
        .bindPopup(`<div class="font-semibold">${city.name} City Center</div>`)
    })

    const legend = L.control({ position: "bottomright" })
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "bg-white p-4 rounded-lg shadow-lg border border-gray-200")
      div.innerHTML = `
        <div class="space-y-3 max-w-xs">
          <div class="font-bold text-sm">Zone Status Legend</div>
          
          <div class="border-t pt-3">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-5 h-5 rounded" style="background-color: #ef4444;"></div>
              <div>
                <div class="text-xs font-semibold">🔴 Critical Issues</div>
                <div class="text-xs text-gray-600">Congestion >75%, Waste <50%, Power outages >8/month</div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 mb-2">
              <div class="w-5 h-5 rounded" style="background-color: #eab308;"></div>
              <div>
                <div class="text-xs font-semibold">🟡 Warning Level</div>
                <div class="text-xs text-gray-600">Congestion 50-75%, Waste 65-85%, Power outages 3-8/month</div>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded" style="background-color: #22c55e;"></div>
              <div>
                <div class="text-xs font-semibold">🟢 Good Status</div>
                <div class="text-xs text-gray-600">Congestion <50%, Waste >85%, Power outages <3/month</div>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-3">
            <div class="text-xs text-gray-600">
              <div class="font-semibold mb-1">Metrics Measured:</div>
              <ul class="space-y-1">
                <li>🚗 Traffic Congestion Levels</li>
                <li>♻️ Waste Collection Efficiency</li>
                <li>⚡ Power Outage Frequency</li>
                <li>💧 Water Quality Index</li>
                <li>📋 Grievance Resolution Rate</li>
                <li>🚑 Emergency Response Time</li>
              </ul>
            </div>
          </div>
          
          <div class="text-xs text-gray-500 pt-2 border-t">
            Click on zones for detailed metrics
          </div>
        </div>
      `
      return div
    }
    legend.addTo(mapInstance)

    setMap(mapInstance)

    return () => {
      mapInstance.remove()
    }
  }, [])

  return (
    <div className="w-full h-screen rounded-lg overflow-visible border border-border bg-muted relative">
      <div id="india-map" className="w-full h-full" />

      {/* Search Bar - Absolute positioning overlay on top of map */}
      <div className="absolute top-4 left-4 z-[9999] bg-white rounded-lg shadow-xl border border-border p-4 w-96 pointer-events-auto">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search locality or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    searchLocality(searchQuery)
                  }
                }}
                className="w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <Button
              onClick={() => searchLocality(searchQuery)}
              disabled={isSearching || !searchQuery.trim()}
              size="sm"
              className="gap-2 whitespace-nowrap"
            >
              {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </Button>
            {searchedMarkers.length > 0 && (
              <Button onClick={clearSearch} variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
                Clear
              </Button>
            )}
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="bg-gray-50 border border-border rounded-md p-2 max-h-64 overflow-y-auto space-y-1">
              <p className="text-xs font-semibold text-gray-600 px-2 py-1">Search Results</p>
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => pinLocation(result)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-200"
                  type="button"
                >
                  <div className="font-medium text-xs truncate">{result.display_name.split(",")[0]}</div>
                  <div className="text-xs text-gray-500 truncate">{result.display_name}</div>
                </button>
              ))}
            </div>
          )}

          {showResults && searchResults.length === 0 && !isSearching && searchQuery && (
            <div className="bg-gray-50 border border-border rounded-md p-3 text-center">
              <p className="text-sm text-gray-600">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapComponent
