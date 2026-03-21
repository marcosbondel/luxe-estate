'use client'

import { useState, useTransition } from 'react'
import { updateUserRole, type UserRole } from '@/app/actions/admin'

interface RoleSelectorProps {
  userId: string
  currentRole: UserRole
  dict: {
    roles: { admin: string; agent: string; user: string }
    updateRole: string
    saving: string
  }
}

const ROLE_ICONS: Record<UserRole, string> = {
  admin: 'shield',
  agent: 'support_agent',
  user: 'person',
}

const ROLE_BADGE: Record<UserRole, string> = {
  admin: 'bg-nordic-dark text-white',
  agent: 'bg-mosque/15 text-mosque',
  user: 'bg-gray-100 text-gray-600',
}

export default function RoleSelector({ userId, currentRole, dict }: RoleSelectorProps) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<UserRole>(currentRole)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const roles: UserRole[] = ['admin', 'agent', 'user']

  const handleSelect = (newRole: UserRole) => {
    setOpen(false)
    if (newRole === role) return
    setError(null)
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)
      if (result.error) {
        setError(result.error)
      } else {
        setRole(newRole)
      }
    })
  }

  return (
    <div className="relative">
      {error && (
        <p className="text-xs text-red-500 mb-1">{error}</p>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
          open
            ? 'bg-nordic-dark text-white border-nordic-dark shadow-md'
            : 'bg-white border-gray-200 text-nordic-dark/70 hover:border-nordic-dark hover:text-nordic-dark'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPending ? (
          <span className="material-icons text-[16px] animate-spin">refresh</span>
        ) : (
          <span className="material-icons text-[16px]">{ROLE_ICONS[role]}</span>
        )}
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${ROLE_BADGE[role]}`}>
          {dict.roles[role]}
        </span>
        <span className="material-icons text-[16px]">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-44 rounded-xl shadow-xl bg-nordic-dark ring-1 ring-black/5 z-40 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-100">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => handleSelect(r)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs transition-colors ${
                  r === role
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-icons text-sm">{ROLE_ICONS[r]}</span>
                {dict.roles[r]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
