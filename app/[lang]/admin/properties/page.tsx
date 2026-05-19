import Link from 'next/link'
import { mockProperties } from '@/src/data/mockProperties'
import { getDictionary } from '@/src/lib/dictionaries'
import { type Locale } from '@/src/lib/i18n'
import type { Property } from '@/src/types/property'

interface AdminPropertiesPageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ q?: string; type?: string; page?: string }>
}

const PAGE_SIZE = 10

const TYPE_BADGE: Record<string, string> = {
  sale: 'bg-emerald-50 text-emerald-700',
  rent: 'bg-blue-50 text-blue-700',
}

export default async function AdminPropertiesPage({ params, searchParams }: AdminPropertiesPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const { q, type, page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10))
  const offset = (currentPage - 1) * PAGE_SIZE

  let filtered = mockProperties as Property[]
  if (q) {
    const query = q.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) || p.location.toLowerCase().includes(query)
    )
  }
  if (type && (type === 'sale' || type === 'rent')) {
    filtered = filtered.filter(p => p.type === type)
  }

  const count = filtered.length
  const properties = filtered.slice(offset, offset + PAGE_SIZE)
  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nordic-dark">{t.sidebar.properties}</h1>
          <p className="text-sm text-nordic-dark/50 mt-1">
            {count} {t.properties.total}
          </p>
        </div>
        <Link
          href={`/${lang}/admin/properties/create`}
          className="px-5 py-2.5 bg-mosque hover:bg-nordic-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span className="material-icons text-sm">add</span>
          {t.properties.addProperty ?? 'Add Property'}
        </Link>
      </div>

      <form method="GET" className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-nordic-dark/30 text-xl">
            search
          </span>
          <input
            name="q"
            defaultValue={q}
            placeholder={t.properties.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-nordic-dark placeholder-nordic-dark/30 focus:outline-none focus:ring-2 focus:ring-mosque focus:border-transparent"
          />
        </div>
        <select
          name="type"
          defaultValue={type ?? ''}
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-nordic-dark focus:outline-none focus:ring-2 focus:ring-mosque"
        >
          <option value="">{t.properties.allTypes}</option>
          <option value="sale">{t.properties.forSale}</option>
          <option value="rent">{t.properties.forRent}</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 bg-mosque text-white rounded-lg text-sm font-medium hover:bg-mosque/90 transition-colors"
        >
          {t.properties.filter}
        </button>
        {(q || type) && (
          <Link
            href={`/${lang}/admin/properties`}
            className="px-5 py-2.5 border border-gray-200 text-nordic-dark/70 rounded-lg text-sm font-medium hover:border-nordic-dark/50 transition-colors"
          >
            {t.properties.clearFilters}
          </Link>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-nordic-dark/40">
          <div className="col-span-5">{t.properties.colProperty}</div>
          <div className="col-span-2">{t.properties.colType}</div>
          <div className="col-span-2">{t.properties.colPrice}</div>
          <div className="col-span-2">{t.properties.colCategory}</div>
          <div className="col-span-1 text-right">{t.properties.colFeatured}</div>
        </div>

        {properties.length === 0 ? (
          <div className="py-16 text-center text-nordic-dark/40">
            <span className="material-icons text-4xl">apartment</span>
            <p className="mt-2 text-sm">{t.properties.noResults}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[#EEF6F6] transition-colors group"
              >
                <div className="col-span-5 flex items-center gap-4 w-full">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-14 h-10 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="material-icons text-gray-300 text-xl">image</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-nordic-dark truncate group-hover:text-mosque transition-colors">
                        {property.title}
                      </p>
                      {property.is_active === false && (
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-nordic-dark/50 truncate mt-0.5">
                      {property.location}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 w-full md:w-auto">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium uppercase ${TYPE_BADGE[property.type] ?? 'bg-gray-100 text-gray-600'}`}>
                    {property.type === 'sale' ? t.properties.forSale : t.properties.forRent}
                  </span>
                </div>

                <div className="col-span-2 text-sm font-semibold text-nordic-dark">
                  {property.price_label ?? `$${property.price.toLocaleString()}`}
                </div>

                <div className="col-span-2 text-sm text-nordic-dark/60 capitalize">
                  {property.category ?? '—'}
                </div>

                <div className="col-span-1 flex justify-end gap-2">
                  {property.is_featured ? (
                    <span className="material-icons text-mosque text-xl" title="Featured">star</span>
                  ) : (
                    <span className="material-icons text-gray-200 text-xl" title="Not featured">star_border</span>
                  )}
                  <Link
                    href={`/${lang}/admin/properties/${property.id}`}
                    className="p-1 text-gray-400 hover:text-mosque transition-colors"
                    title={(t as any).propertyForm?.editTitle ?? 'Edit Property'}
                  >
                    <span className="material-icons text-xl">edit</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-nordic-dark/50">
            {t.properties.page} {currentPage} / {totalPages}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/${lang}/admin/properties?${new URLSearchParams({ ...(q ? { q } : {}), ...(type ? { type } : {}), page: String(currentPage - 1) })}`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-nordic-dark hover:border-nordic-dark/40 transition-colors"
              >
                {t.properties.prev}
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/${lang}/admin/properties?${new URLSearchParams({ ...(q ? { q } : {}), ...(type ? { type } : {}), page: String(currentPage + 1) })}`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-nordic-dark hover:border-nordic-dark/40 transition-colors"
              >
                {t.properties.next}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
