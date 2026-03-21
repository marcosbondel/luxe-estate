import Link from 'next/link'

interface AdminSidebarProps {
  lang: string
  activePath: string
  dict: {
    title: string
    dashboard: string
    properties: string
    users: string
    backToSite: string
  }
}

const navItems = [
  { key: 'dashboard', href: '', icon: 'dashboard' },
  { key: 'properties', href: '/properties', icon: 'apartment' },
  { key: 'users', href: '/users', icon: 'group' },
] as const

export default function AdminSidebar({ lang, activePath, dict }: AdminSidebarProps) {
  const base = `/${lang}/admin`

  return (
    <aside className="w-64 shrink-0 bg-nordic-dark text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-mosque flex items-center justify-center">
          <span className="material-icons text-white text-lg">apartment</span>
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">LuxeEstate</p>
          <p className="text-[11px] text-white/50 mt-0.5">{dict.title}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ key, href, icon }) => {
          const fullHref = `${base}${href}`
          const isActive = activePath === fullHref || (href !== '' && activePath.startsWith(fullHref))

          return (
            <Link
              key={key}
              href={fullHref}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-mosque text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-icons text-[20px]">{icon}</span>
              {dict[key as keyof typeof dict]}
            </Link>
          )
        })}
      </nav>

      {/* Back to site */}
      <div className="px-3 pb-6">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-icons text-[20px]">arrow_back</span>
          {dict.backToSite}
        </Link>
      </div>
    </aside>
  )
}
