"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"

export type UserRole = "citizen-leader" | "citizen" | "worker" | "chief_minister" | "district_magistrate" | "deputy_district_magistrate" | "mayor" | "municipal_commissioner" | "department_head" | null

export type AdminRole = "chief_minister" | "district_magistrate" | "deputy_district_magistrate" | "mayor" | "municipal_commissioner" | "department_head"

export interface Jurisdiction {
  id: number
  name: string
  type: "state" | "district" | "city" | "municipality"
  parentId?: number
}

export interface Department {
  id: number
  name: string
  head_id?: number
  jurisdiction_id: number
}

export interface AdminProfile {
  id: number
  userId: string
  name: string
  email: string
  phone?: string
  adminRole: AdminRole
  jurisdiction: Jurisdiction
  departments?: Department[]
  superiorId?: number
  isActive: boolean
  permissions: {
    can_delegate: boolean
    can_escalate: boolean
    can_approve: boolean
    can_assign_departments: boolean
  }
}

interface UserContextType {
  role: UserRole
  userId?: string
  adminProfile?: AdminProfile
  isLoading: boolean
  login: (role: UserRole, userId?: string, adminProfile?: AdminProfile) => void
  logout: () => void
  updateAdminProfile: (profile: AdminProfile) => void
  hasPermission: (permission: keyof AdminProfile['permissions']) => boolean
  canAccessJurisdiction: (jurisdictionId: number) => boolean
  getHierarchyLevel: () => number
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  chief_minister: 1,
  district_magistrate: 2,
  deputy_district_magistrate: 3,
  mayor: 4,
  municipal_commissioner: 5,
  department_head: 6,
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null)
  const [userId, setUserId] = useState<string>()
  const [adminProfile, setAdminProfile] = useState<AdminProfile>()
  const [isLoading, setIsLoading] = useState(true)

  // ── Bootstrap from cookies on load ──────────────────────────────
  useEffect(() => {
    function bootstrap() {
      try {
        const cookies = document.cookie.split("; ")
        const userCookie = cookies.find(row => row.startsWith("civilio-user="))

        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie.split("=")[1]))
          const roleFromCookie = userData.role || "citizen"
          const mappedRole: UserRole =
            roleFromCookie === "official" ? "citizen-leader" :
              roleFromCookie === "vendor" ? "worker" :
                "citizen"
          setRole(mappedRole)
          setUserId(userData.userId)
        } else {
          setRole(null)
          setUserId(undefined)
        }
      } catch (err) {
        console.error("Failed to parse user cookie", err)
      } finally {
        setIsLoading(false)
      }
    }
    bootstrap()
  }, [])

  const login = (newRole: UserRole, newUserId?: string, newAdminProfile?: AdminProfile) => {
    setRole(newRole)
    setUserId(newUserId)
    if (newAdminProfile) {
      setAdminProfile(newAdminProfile)
    }
  }

  const logout = () => {
    setRole(null)
    setUserId(undefined)
    setAdminProfile(undefined)
  }

  const updateAdminProfile = (profile: AdminProfile) => {
    setAdminProfile(profile)
  }

  const hasPermission = (permission: keyof AdminProfile['permissions']): boolean => {
    return adminProfile?.permissions[permission] ?? false
  }

  const canAccessJurisdiction = (jurisdictionId: number): boolean => {
    if (!adminProfile) return false

    // Admin can access their own jurisdiction
    if (adminProfile.jurisdiction.id === jurisdictionId) return true

    // Chief Minister can access all jurisdictions
    if (adminProfile.adminRole === "chief_minister") return true

    // Check if it's a child jurisdiction
    return checkJurisdictionHierarchy(adminProfile.jurisdiction.id, jurisdictionId)
  }

  const getHierarchyLevel = (): number => {
    if (!adminProfile) return 999 // Non-admin, lowest priority
    return ROLE_HIERARCHY[adminProfile.adminRole]
  }

  const checkJurisdictionHierarchy = (parentId: number, childId: number): boolean => {
    // This would normally query the database to check jurisdiction hierarchy
    // For now, returning false - will be enhanced with actual hierarchy checks
    return false
  }

  return (
    <UserContext.Provider
      value={{
        role,
        userId,
        adminProfile,
        isLoading,
        login,
        logout,
        updateAdminProfile,
        hasPermission,
        canAccessJurisdiction,
        getHierarchyLevel,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export function useAdminAuth() {
  const { adminProfile, hasPermission, canAccessJurisdiction } = useUser()

  if (!adminProfile) {
    throw new Error("useAdminAuth must be used within an admin context")
  }

  return {
    adminProfile,
    hasPermission,
    canAccessJurisdiction,
    isChiefMinister: adminProfile.adminRole === "chief_minister",
    isDistrictMagistrate: adminProfile.adminRole === "district_magistrate",
    isMayor: adminProfile.adminRole === "mayor",
    isDepartmentHead: adminProfile.adminRole === "department_head",
  }
}
