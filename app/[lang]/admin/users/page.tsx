import { mockUsers } from '@/src/data/mockProperties'
import { getDictionary } from '@/src/lib/dictionaries'
import { type Locale } from '@/src/lib/i18n'
import RoleSelector from '@/src/components/admin/RoleSelector'
import type { UserRole } from '@/app/actions/admin'

interface AdminUsersPageProps {
  params: Promise<{ lang: string }>
}

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-nordic-dark text-white',
  agent: 'bg-mosque/15 text-mosque',
  user: 'bg-gray-100 text-gray-600',
}

const ROLE_ICON: Record<string, string> = {
  admin: 'shield',
  agent: 'support_agent',
  user: 'person',
}

export default async function AdminUsersPage({ params }: AdminUsersPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const userList = mockUsers

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nordic-dark">{t.sidebar.users}</h1>
          <p className="text-sm text-nordic-dark/50 mt-1">
            {userList.length} {t.users.total}
          </p>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-nordic-dark/40 mb-2">
        <div className="col-span-5">{t.users.colUser}</div>
        <div className="col-span-3">{t.users.colRole}</div>
        <div className="col-span-2">{t.users.colJoined}</div>
        <div className="col-span-2 text-right">{t.users.colActions}</div>
      </div>

      {userList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center text-nordic-dark/40">
          <span className="material-icons text-4xl">group</span>
          <p className="mt-2 text-sm">{t.users.noUsers}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userList.map((userRow) => {
            const initials = userRow.full_name
              ? userRow.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
              : userRow.email
                ? userRow.email[0].toUpperCase()
                : '?'

            const joinedDate = new Date(userRow.created_at).toLocaleDateString(lang, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })

            const role = (userRow.role ?? 'user') as UserRole

            return (
              <div
                key={userRow.id}
                className={`rounded-xl p-5 border transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
                  role === 'admin'
                    ? 'bg-[#D9ECC8]/30 border-[#D9ECC8]'
                    : 'bg-white border-gray-100 shadow-sm hover:bg-[#EEF6F6]'
                }`}
              >
                <div className="col-span-5 flex items-center gap-4 w-full">
                  <div className="relative shrink-0">
                    {userRow.avatar_url ? (
                      <img
                        src={userRow.avatar_url}
                        alt={userRow.full_name ?? 'User'}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-mosque/20 flex items-center justify-center text-mosque font-semibold text-sm border-2 border-white shadow-sm">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-nordic-dark truncate">
                      {userRow.full_name || t.users.unknownUser}
                    </p>
                    <p className="text-xs text-nordic-dark/60 truncate mt-0.5">
                      {userRow.email ?? '—'}
                    </p>
                    <p className="text-[10px] px-2 py-0.5 inline-block bg-gray-50 rounded text-nordic-dark/40 mt-1">
                      {userRow.user_id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 w-full flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${ROLE_BADGE[role]}`}>
                    <span className="material-icons text-[14px]">{ROLE_ICON[role]}</span>
                    {t.users.roles[role]}
                  </span>
                </div>

                <div className="col-span-2 text-xs text-nordic-dark/50">
                  {joinedDate}
                </div>

                <div className="col-span-2 flex justify-end w-full">
                  <RoleSelector
                    userId={userRow.user_id}
                    currentRole={role}
                    dict={{
                      roles: t.users.roles,
                      updateRole: t.users.updateRole,
                      saving: t.users.saving,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
