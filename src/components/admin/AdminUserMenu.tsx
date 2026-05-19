'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUserMenuProps {
  email: string
  fullName: string
  avatarUrl?: string | null
  signOutLabel: string
}

export default function AdminUserMenu({ email, fullName, avatarUrl, signOutLabel }: AdminUserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : email[0].toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-mosque/20"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-mosque/20 flex items-center justify-center text-mosque text-xs font-semibold">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-nordic-dark leading-none">{fullName}</p>
          <p className="text-xs text-nordic-dark/50 mt-0.5">{email}</p>
        </div>
        <span
          className="material-icons text-nordic-dark/30 text-[18px] hidden sm:block transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-sm font-medium text-nordic-dark truncate">{fullName}</p>
            <p className="text-xs text-nordic-dark/50 truncate">{email}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="material-icons text-[18px]">logout</span>
            {signOutLabel}
          </button>
        </div>
      )}
    </div>
  )
}
