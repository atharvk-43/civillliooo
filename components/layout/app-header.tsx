"use client"

import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { role, logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getNavLinks = () => {
    if (role === "citizen-leader") {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Leader Portal", href: "/citizen-leader/dashboard" },
      ]
    } else if (role === "citizen") {
      return [
        { label: "Submit Grievance", href: "/citizen-portal" },
        { label: "Login", href: "/login" },
      ]
    }
    return [{ label: "Login", href: "/login" }]
  }

  const navLinks = getNavLinks()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href={role === "citizen-leader" ? "/" : "/citizen-portal"}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              C
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground">Civilio</h1>
              <p className="text-xs text-muted-foreground">
                {role === "citizen-leader"
                  ? "Leadership Portal"
                  : role === "citizen"
                    ? "Citizen Portal"
                    : "City Operations"}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {role && (
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-foreground hover:text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {role && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2"
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        )}
      </header>
    </>
  )
}
