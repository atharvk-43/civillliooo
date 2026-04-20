"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Users, Landmark, HardHat, ChevronRight, ArrowLeft,
  CheckCircle, AlertCircle, Loader2, Eye, EyeOff, Shield
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "citizen" | "official" | "vendor" | null
type Mode = "signup" | "login"

// ─── Role Config ──────────────────────────────────────────────────────────────
const ROLES = [
  {
    id: "citizen" as Role,
    title: "Citizen",
    subtitle: "I am a resident",
    description: "Submit grievances, track civic issues, and engage with city services",
    icon: Users,
    gradient: "from-blue-500 to-indigo-600",
    bg: "hover:bg-blue-50 dark:hover:bg-blue-950/30 group-hover:border-blue-400",
    badge: "🏘️",
    idProofs: [
      { id: "aadhaar", label: "Aadhaar Card Number", placeholder: "XXXX XXXX XXXX", pattern: "\\d{4}\\s?\\d{4}\\s?\\d{4}", hint: "12-digit Aadhaar number" },
      { id: "voter_id", label: "Voter ID Card (EPIC)", placeholder: "ABC1234567", hint: "10-character alphanumeric EPIC number" },
      { id: "pan", label: "PAN Card", placeholder: "ABCDE1234F", pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}", hint: "10-character PAN (e.g. ABCDE1234F)" },
    ]
  },
  {
    id: "official" as Role,
    title: "Government Official",
    subtitle: "I am a public servant",
    description: "Manage governance, review grievances, and coordinate policy and administration",
    icon: Landmark,
    gradient: "from-violet-500 to-purple-700",
    bg: "hover:bg-violet-50 dark:hover:bg-violet-950/30 group-hover:border-violet-400",
    badge: "🏛️",
    idProofs: [
      { id: "aadhaar_passport", label: "Aadhaar / Passport Number", placeholder: "Enter Aadhaar or Passport number", hint: "For identity verification" },
      { id: "posting_order", label: "Official Posting Order / Secretariat ID", placeholder: "e.g. MHA/2024/PO/00123", hint: "Issued by your ministry or department" },
      { id: "gov_email", label: "Government / NIC Email", placeholder: "name.dept@ias.gov.in", hint: "Official gov.in or nic.in email address" },
    ]
  },
  {
    id: "vendor" as Role,
    title: "Worker / Vendor",
    subtitle: "I am a contractor or supplier",
    description: "Access work orders, submit bids, and manage contracts with municipal authorities",
    icon: HardHat,
    gradient: "from-amber-500 to-orange-600",
    bg: "hover:bg-amber-50 dark:hover:bg-amber-950/30 group-hover:border-amber-400",
    badge: "🛠️",
    idProofs: [
      { id: "gstin", label: "GST Registration (GSTIN)", placeholder: "22AAAAA0000A1Z5", hint: "15-digit alphanumeric GSTIN" },
      { id: "msme", label: "MSME / Udyam Registration Number", placeholder: "UDYAM-XX-00-0000000", hint: "Udyam Registration Certificate number" },
      { id: "pan_business", label: "PAN of Business / Firm", placeholder: "ABCDE1234F", hint: "10-character PAN of the entity" },
      { id: "trade_license", label: "Trade License / Shop & Establishment", placeholder: "TL/2024/MUN/00123", hint: "Issued by municipal authority" },
    ]
  }
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuthPortalPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [mode, setMode] = useState<Mode>("signup")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    id_proof_type: "", id_proof_value: "",
    extra_proofs: {} as Record<string, string>
  })

  const roleConfig = ROLES.find(r => r.id === selectedRole)

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setStep(2)
    setError("")
  }

  const handleBack = () => {
    setStep(1)
    setSelectedRole(null)
    setError("")
    setSuccess("")
    setForm({ name: "", email: "", password: "", id_proof_type: "", id_proof_value: "", extra_proofs: {} })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/universal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || form.email.split("@")[0] || "Anonymous",
          email: form.email,
          credential: form.password
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed")
      }

      const roleToUse = selectedRole || "citizen"
      setSessionCookie(data.userId, form.name || "Anonymous", form.email, roleToUse)

      // Portal redirection based on role
      if (roleToUse === "official") {
        window.location.href = "/citizen-leader/dashboard"
      } else if (roleToUse === "vendor") {
        window.location.href = "/worker/dashboard"
      } else {
        window.location.href = "/citizen-portal"
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function setSessionCookie(userId: string, name: string, email: string, role: string) {
    document.cookie = `civilio-user=${encodeURIComponent(
      JSON.stringify({ userId, name, email, role })
    )}; path=/; max-age=86400`
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{
      background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #141030 100%)"
    }}>
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Civillio</span>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= 1 ? "bg-purple-500 text-white" : "bg-white/10"}`}>1</span>
          <div className={`w-8 h-px transition-all ${step >= 2 ? "bg-purple-500" : "bg-white/20"}`} />
          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= 2 ? "bg-purple-500 text-white" : "bg-white/10"}`}>2</span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {step === 1 ? (
          // ─── STEP 1: Role Selection ────────────────────────────────────────
          <div className="w-full max-w-3xl fade-up">
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
                Welcome to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Civillio</span>
              </h1>
              <p className="text-white/50 text-lg">India's smart civic engagement platform. Who are you?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ROLES.map((role, i) => {
                const Icon = role.icon
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group relative text-left p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                      animationDelay: `${i * 80}ms`
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  >
                    {/* Gradient glow on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${role.gradient} blur-xl -z-10 scale-110`} />

                    <span className="text-4xl mb-4 block">{role.badge}</span>
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl mb-4 bg-gradient-to-br ${role.gradient} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-1">{role.title}</h3>
                    <p className="text-white/40 text-sm mb-1">{role.subtitle}</p>
                    <p className="text-white/30 text-xs leading-relaxed mb-5">{role.description}</p>
                    <div className="flex items-center gap-1 text-purple-400 text-sm font-semibold group-hover:gap-2 transition-all">
                      Continue <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                )
              })}
            </div>

            <p className="text-center text-white/25 text-xs mt-8">
              © 2026 Civillio — Smart Governance Platform for India
            </p>
          </div>
        ) : (
          // ─── STEP 2: Auth Form ─────────────────────────────────────────────
          <div className="w-full max-w-lg fade-up">
            {/* Back button */}
            <button onClick={handleBack} className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-6 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Choose a different role
            </button>

            {/* Card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {/* Card Header */}
              <div className="px-7 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3 mb-3">
                  {roleConfig && (
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${roleConfig.gradient}`}>
                      <roleConfig.icon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-white font-bold text-xl">{roleConfig?.title} Portal</h2>
                    <p className="text-white/40 text-xs">{roleConfig?.subtitle}</p>
                  </div>
                </div>
                {/* Login / Signup toggle */}
                <div className="flex gap-1 p-1 rounded-xl mt-4" style={{ background: "rgba(0,0,0,0.3)" }}>
                  {(["signup", "login"] as Mode[]).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMode(m); setError(""); setSuccess("") }}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === m ? "text-white shadow-md" : "text-white/40 hover:text-white/70"}`}
                      style={mode === m ? { background: "linear-gradient(135deg,#6366f1,#7c3aed)" } : {}}
                    >
                      {m === "signup" ? "New Account" : "Sign In"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex gap-2 text-sm text-green-300">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
                    <p>{success}</p>
                  </div>
                )}

                {/* Common fields */}
                {mode === "signup" && (
                  <FormField label="Full Name *">
                    <input
                      required
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="auth-input"
                    />
                  </FormField>
                )}

                <FormField label="Email Address *">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="auth-input"
                  />
                </FormField>

                <FormField label="Password *">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className="auth-input pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>

                {/* Role-specific ID proof fields (only for signup) */}
                {mode === "signup" && roleConfig && (
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Identity Verification</span>
                    </div>
                    <div className="rounded-xl p-4 space-y-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {roleConfig.idProofs.map((proof, idx) => (
                        <FormField key={proof.id} label={proof.label} hint={proof.hint}>
                          <input
                            required={idx === 0}
                            placeholder={proof.placeholder}
                            value={idx === 0 ? form.id_proof_value : (form.extra_proofs[proof.id] || "")}
                            onChange={e => {
                              if (idx === 0) {
                                setForm({ ...form, id_proof_type: proof.id, id_proof_value: e.target.value })
                              } else {
                                setForm({ ...form, extra_proofs: { ...form.extra_proofs, [proof.id]: e.target.value } })
                              }
                            }}
                            className="auth-input font-mono"
                          />
                        </FormField>
                      ))}
                      <p className="text-white/25 text-[11px] mt-2">
                        * Primary ID is required. Other IDs help expedite verification.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-semibold text-white text-base flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)" }}
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : mode === "signup" ? (
                    <><CheckCircle className="h-5 w-5" /> Create {roleConfig?.title} Account</>
                  ) : (
                    "Sign In to Civillio →"
                  )}
                </button>
              </form>
            </div>

            {/* Global inline styles for inputs */}
            <style>{`
              .auth-input {
                width: 100%;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 10px 14px;
                color: white;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
              }
              .auth-input::placeholder { color: rgba(255,255,255,0.25); }
              .auth-input:focus { border-color: rgba(139,92,246,0.6); }
            `}</style>

            <p className="text-center text-white/20 text-xs mt-6">
              All data is encrypted and stored securely. By signing up, you agree to our terms.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-white/60 text-xs font-semibold">{label}</label>
      {children}
      {hint && <p className="text-white/25 text-[11px]">{hint}</p>}
    </div>
  )
}
