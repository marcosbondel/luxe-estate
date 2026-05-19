'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

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

export default function UserMenu({ user, lang = 'en', signIn = 'Sign In' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-nordic-dark truncate">{user.full_name || 'User'}</p>
            <p className="text-xs text-nordic-dark/60 truncate">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  )
}
