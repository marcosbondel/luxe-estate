'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function LoginPage() {
  const params = useParams()
  const lang = params?.lang ?? 'en'

  return (
    <div className="font-display bg-background-light min-h-screen flex items-center justify-center p-4 antialiased text-nordic-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-hint-of-green/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-mosque/10 rounded-full blur-3xl"></div>
      </div>

      <main className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-mosque rounded-xl mb-6 shadow-soft text-white">
            <span className="material-symbols-rounded text-3xl">real_estate_agent</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-nordic-dark mb-2">
            Welcome to LuxeEstate
          </h1>
          <p className="text-nordic-dark/60">
            Unlock exclusive properties worldwide.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8 sm:p-10 border border-white/50 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-mosque/10 rounded-full text-mosque mb-2">
              <span className="material-icons text-2xl">info</span>
            </div>
            <p className="text-sm text-nordic-dark/70">
              This is a demo — authentication is disabled. The admin panel is open to all visitors.
            </p>
            <Link
              href={`/${lang}/admin`}
              className="block w-full py-3 px-6 bg-mosque hover:bg-mosque/90 text-white rounded-lg font-medium transition-colors text-center"
            >
              Go to Admin Panel
            </Link>
            <Link
              href={`/${lang}`}
              className="block w-full py-3 px-6 border border-gray-200 text-nordic-dark/70 rounded-lg font-medium hover:border-gray-300 transition-colors text-center"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
