import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/src/lib/supabase/server'
import { getDictionary } from '@/src/lib/dictionaries'
import { type Locale } from '@/src/lib/i18n'
import AdminSidebar from '@/src/components/admin/AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  // Verify authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  // Verify admin role (user can always read their own row via RLS)
  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleRow?.role !== 'admin') {
    redirect(`/${lang}`)
  }

  // Get current pathname to highlight active nav item
  const headersList = await headers()
  const activePath = headersList.get('x-invoke-path') ?? `/${lang}/admin`

  return (
    <div className="flex min-h-screen bg-[#EEF6F6]">
      <AdminSidebar
        lang={lang}
        activePath={activePath}
        dict={dict.admin.sidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-mosque/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-mosque flex items-center justify-center text-white text-xs font-semibold">
                {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-nordic-dark leading-none">
                {user.user_metadata?.full_name || user.user_metadata?.name || 'Admin'}
              </p>
              <p className="text-xs text-nordic-dark/50 mt-0.5">{user.email}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
