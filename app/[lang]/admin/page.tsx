import Link from 'next/link'
import { createAdminClient } from '@/src/lib/supabase/admin'
import { supabase } from '@/src/lib/supabase'
import { getDictionary } from '@/src/lib/dictionaries'
import { type Locale } from '@/src/lib/i18n'

interface AdminPageProps {
  params: Promise<{ lang: string }>
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  // Stats
  const adminClient = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalProperties },
    { count: adminCount },
    { count: agentCount },
  ] = await Promise.all([
    adminClient.from('user_roles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    adminClient.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    adminClient.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'agent'),
  ])

  const stats = [
    {
      label: t.stats.totalProperties,
      value: totalProperties ?? 0,
      icon: 'apartment',
      href: `/${lang}/admin/properties`,
      color: 'bg-mosque/10 text-mosque',
    },
    {
      label: t.stats.totalUsers,
      value: totalUsers ?? 0,
      icon: 'group',
      href: `/${lang}/admin/users`,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: t.stats.admins,
      value: adminCount ?? 0,
      icon: 'shield',
      href: `/${lang}/admin/users`,
      color: 'bg-nordic-dark/10 text-nordic-dark',
    },
    {
      label: t.stats.agents,
      value: agentCount ?? 0,
      icon: 'support_agent',
      href: `/${lang}/admin/users`,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-nordic-dark">{t.overview}</h1>
        <p className="text-sm text-nordic-dark/50 mt-1">{t.overviewSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <span className="material-icons text-[20px]">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-nordic-dark group-hover:text-mosque transition-colors">
              {stat.value}
            </p>
            <p className="text-sm text-nordic-dark/50 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/${lang}/admin/properties`}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-mosque/10 flex items-center justify-center">
            <span className="material-icons text-mosque text-2xl">apartment</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-nordic-dark group-hover:text-mosque transition-colors">
              {t.sidebar.properties}
            </p>
            <p className="text-sm text-nordic-dark/50">{t.propertiesSubtitle}</p>
          </div>
          <span className="material-icons text-nordic-dark/30 group-hover:text-mosque transition-colors">
            arrow_forward
          </span>
        </Link>

        <Link
          href={`/${lang}/admin/users`}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <span className="material-icons text-blue-500 text-2xl">group</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-nordic-dark group-hover:text-mosque transition-colors">
              {t.sidebar.users}
            </p>
            <p className="text-sm text-nordic-dark/50">{t.usersSubtitle}</p>
          </div>
          <span className="material-icons text-nordic-dark/30 group-hover:text-mosque transition-colors">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  )
}
