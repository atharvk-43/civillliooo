"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Users, Landmark, HardHat, ChevronRight, ArrowLeft,
  CheckCircle, AlertCircle, Loader2, Eye, EyeOff, Shield, Sparkles
} from "lucide-react"

type Role = "citizen" | "official" | "vendor" | null
type Mode = "signup" | "login"

const ROLES = [
  {
    id: "citizen" as Role,
    title: "Citizen",
    subtitle: "I am a resident",
    description: "Submit grievances, track civic issues, and engage with city services",
    icon: Users,
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
    badge: "🛠️",
    idProofs: [
      { id: "gstin", label: "GST Registration (GSTIN)", placeholder: "22AAAAA0000A1Z5", hint: "15-digit alphanumeric GSTIN" },
      { id: "msme", label: "MSME / Udyam Registration Number", placeholder: "UDYAM-XX-00-0000000", hint: "Udyam Registration Certificate number" },
      { id: "pan_business", label: "PAN of Business / Firm", placeholder: "ABCDE1234F", hint: "10-character PAN of the entity" },
      { id: "trade_license", label: "Trade License / Shop & Establishment", placeholder: "TL/2024/MUN/00123", hint: "Issued by municipal authority" },
    ]
  }
]

export default function AuthPortalPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [mode, setMode] = useState<Mode>("signup")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

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
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-black">
      {/* Subtle geometric background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Elegant grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(0deg,#fff_1px,transparent_1px)] bg-[length:50px_50px]" />

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .slide-up { animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg tracking-tight">Civillio</span>
            <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Smart Governance</span>
          </div>
        </div>
        
        {/* Step indicator */}
        <div className="flex items-center gap-3">
          <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step >= 1 ? "bg-white" : "bg-white/20"}`} />
          <span className="text-white/60 text-xs font-medium">{step} / 2</span>
          <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step >= 2 ? "bg-white" : "bg-white/20"}`} />
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {step === 1 ? (
          // STEP 1: Role Selection
          <div className="w-full max-w-5xl">
            <div className="text-center mb-16 slide-up">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-white/60" />
                <span className="text-white/60 text-sm font-medium uppercase tracking-widest">Welcome</span>
                <Sparkles className="h-5 w-5 text-white/60" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight mb-4 leading-tight">
                Access Your Civic Platform
              </h1>
              <p className="text-white/50 text-lg font-light max-w-2xl mx-auto">
                Select your role to continue to Civillio, India&apos;s smart governance platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {ROLES.map((role, i) => {
                const Icon = role.icon
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group relative text-left p-8 rounded-2xl border border-white/10 transition-all duration-300 hover:border-white/30 hover:bg-white/2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-white/2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative">
                      <span className="text-5xl mb-6 block">{role.badge}</span>
                      <div className="h-12 w-12 rounded-xl bg-white mb-6 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-black" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2">{role.title}</h3>
                      <p className="text-white/50 text-sm mb-1 font-medium">{role.subtitle}</p>
                      <p className="text-white/40 text-sm leading-relaxed mb-6">{role.description}</p>
                      <div className="flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                        Access Portal <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="text-center border-t border-white/5 pt-8">
              <p className="text-white/30 text-xs font-light">
                © 2026 Civillio — Secure. Transparent. Democratic.
              </p>
            </div>
          </div>
        ) : (
          // STEP 2: Auth Form
          <div className="w-full max-w-lg slide-up">
            {/* Back button */}
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Choose different role
            </button>

            {/* Card */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/2 backdrop-blur-sm">
              {/* Card Header */}
              <div className="px-8 py-8 border-b border-white/5">
                <div className="flex items-center gap-4 mb-6">
                  {roleConfig && (
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
                      <roleConfig.icon className="h-6 w-6 text-black" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-white font-bold text-2xl">{roleConfig?.title}</h2>
                    <p className="text-white/40 text-sm">{roleConfig?.subtitle}</p>
                  </div>
                </div>

                {/* Login / Signup toggle */}
                <div className="flex gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
                  {(["signup", "login"] as Mode[]).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMode(m); setError(""); setSuccess("") }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === m ? "text-black bg-white shadow-lg" : "text-white/60 hover:text-white"}`}
                    >
                      {m === "signup" ? "New Account" : "Sign In"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex gap-3 text-sm text-green-300">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{success}</p>
                  </div>
                )}

                {/* Common fields */}
                {mode === "signup" && (
                  <FormField label="Full Name">
                    <input
                      required
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="auth-input"
                    />
                  </FormField>
                )}

                <FormField label="Email Address">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="auth-input"
                  />
                </FormField>

                <FormField label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Enter password (min. 6 characters)"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className="auth-input pr-10"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>

                {/* Role-specific ID proof fields */}
                {mode === "signup" && roleConfig && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-4 w-4 text-white" />
                      <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Identity Verification</span>
                    </div>
                    <div className="rounded-xl p-5 space-y-4 border border-white/5 bg-white/2">
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
                            className="auth-input font-mono text-xs"
                          />
                        </FormField>
                      ))}
                      <p className="text-white/30 text-xs pt-1">
                        * Primary ID is required. Additional IDs help expedite verification.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3 text-sm text-red-300">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-semibold text-black text-base flex items-center justify-center gap-2 transition-all duration-300 bg-white hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : mode === "signup" ? (
                    <><CheckCircle className="h-5 w-5" /> Create Account</>
                  ) : (
                    <>Sign In</>
                  )}
                </button>
              </form>
            </div>

            <style>{`
              .auth-input {
                width: 100%;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 0.75rem;
                padding: 0.75rem 1rem;
                color: white;
                font-size: 0.875rem;
                outline: none;
                transition: all 0.2s ease;
              }
              .auth-input::placeholder { 
                color: rgba(255, 255, 255, 0.3); 
              }
              .auth-input:focus { 
                border-color: rgba(255, 255, 255, 0.3);
                background: rgba(255, 255, 255, 0.08);
                box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
              }
            `}</style>

            <p className="text-center text-white/30 text-xs mt-6 font-light">
              Your data is encrypted and secured. By continuing, you agree to our terms.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-white/70 text-xs font-semibold uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-white/30 text-xs">{hint}</p>}
    </div>
  )
}
