import { CitizenLoginForm } from '@/components/auth/citizen-login-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Citizen Login - Civilio',
  description: 'Authenticate as a citizen with Aadhar, PAN, or Voter ID',
}

export default function CitizenLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link href="/auth/portal">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Portal Selection
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CitizenLoginForm />

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-lg text-foreground mb-4">Citizen Portal</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Access the civic participation platform to report issues, track grievances, and view community impact.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Report local issues and grievances
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Track grievance resolution status
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Earn civil points for civic participation
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Vote for responsible civic leaders
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                Accepted Identification:
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Aadhar (12-digit)</li>
                <li>• PAN (10-digit tax ID)</li>
                <li>• Voter ID (EPIC)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
