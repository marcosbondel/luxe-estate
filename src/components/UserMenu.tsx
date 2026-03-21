'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/src/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
  user?: {
    email?: string;
    avatar_url?: string;
    full_name?: string;
  } | null;
  lang?: string;
  signIn?: string;
  signOut?: string;
}

export default function UserMenu({ user, lang = 'en', signIn = 'Sign In', signOut = 'Sign Out' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.refresh()
  }

  // Not logged in → show sign in link
  if (!user) {
    return (
      <Link
        href={`/${lang}/login`}
        className="flex items-center gap-2 text-sm font-medium text-mosque hover:text-mosque/80 transition-colors"
      >
        <span className="material-icons text-xl">login</span>
        <span className="hidden sm:inline">{signIn}</span>
      </Link>
    )
  }

  // Get initials for fallback avatar
  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email
      ? user.email[0].toUpperCase()
      : '?'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all cursor-pointer"
      >
        {user.avatar_url ? (
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src={user.avatar_url}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-mosque flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-nordic-dark truncate">
              {user.full_name || 'User'}
            </p>
            <p className="text-xs text-nordic-dark/60 truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-icons text-lg">logout</span>
            {signOut}
          </button>
        </div>
      )}
    </div>
  )
}
