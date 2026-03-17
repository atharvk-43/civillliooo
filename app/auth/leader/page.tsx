import { LeaderLoginForm } from '@/components/auth/leader-login-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Administrative Leader Login - Civilio',
  description: 'Authenticate as an administrative leader with appointment credentials',
}

export default function LeaderLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 flex items-center justify-center py-12 px-4">
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
          <LeaderLoginForm />

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-lg text-foreground mb-4">Administrative Dashboard</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Manage grievances, delegate tasks, oversee district operations, and monitor performance metrics.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  Hierarchical governance workflows
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  Delegate to mayors and district magistrates
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  Manage department authorities
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  View comprehensive audit trails
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/50 rounded-lg p-4 border border-purple-200 dark:border-purple-900">
              <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-2">
                Supported Positions:
              </h3>
              <ul className="text-xs text-purple-800 dark:text-purple-200 space-y-1">
                <li>• Chief Minister (CM)</li>
                <li>• District Magistrate (DM)</li>
                <li>• Deputy District Magistrate (DDM)</li>
                <li>• Mayor</li>
                <li>• Municipal Commissioner</li>
                <li>• Department Head</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Administrative verification requires valid appointment letter and government database confirmation (2-3 business days).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
