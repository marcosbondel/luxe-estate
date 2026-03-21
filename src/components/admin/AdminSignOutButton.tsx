'use client'

import { createClient } from '@/src/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminSignOutButton({ label }: { label: string }) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-nordic-dark/60 hover:text-red-600 hover:bg-red-50 transition-colors"
    >
      <span className="material-icons text-[18px]">logout</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
