import { headers } from 'next/headers'
import { getDictionary } from '@/src/lib/dictionaries'
import { type Locale } from '@/src/lib/i18n'
import AdminSidebar from '@/src/components/admin/AdminSidebar'
import AdminUserMenu from '@/src/components/admin/AdminUserMenu'

interface AdminLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

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
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div />
          <AdminUserMenu
            email="admin@luxeestate.com"
            fullName="Admin"
            avatarUrl={null}
            signOutLabel={dict.navbar.signOut}
          />
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
