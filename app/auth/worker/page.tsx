import { WorkerLoginForm } from '@/components/auth/worker-login-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Worker/Vendor Login - Civilio',
  description: 'Authenticate as a municipal worker or vendor with appointment documents',
}

export default function WorkerLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 flex items-center justify-center py-12 px-4">
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
          <WorkerLoginForm />

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-lg text-foreground mb-4">Worker Portal</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Execute work orders, track task completion, report progress, and manage vendor operations.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  View assigned work orders
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  Report task completion and progress
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  Submit field photos and documentation
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  Track performance and ratings
                </li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-4 border border-green-200 dark:border-green-900">
              <h3 className="font-semibold text-sm text-green-900 dark:text-green-100 mb-2">
                Supported Worker Types:
              </h3>
              <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                <li>• Vendor</li>
                <li>• Contractor</li>
                <li>• Department Staff</li>
                <li>• Field Worker</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Document Upload Required:</strong> Valid appointment letter or municipal permission document with official stamps and signatures. Verification within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
