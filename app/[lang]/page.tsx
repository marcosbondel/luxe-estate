import React from 'react';
import Navbar from '../../src/components/Navbar';
import HeroSection from '../../src/components/HeroSection';
import FeaturedPropertyCard from '../../src/components/FeaturedPropertyCard';
import PropertyCard from '../../src/components/PropertyCard';
import Pagination from '../../src/components/Pagination';
import { supabase } from '../../src/lib/supabase';
import { createClient } from '../../src/lib/supabase/server';
import type { Property } from '../../src/types/property';
import { getDictionary } from '../../src/lib/dictionaries';
import { type Locale } from '../../src/lib/i18n';

const PAGE_SIZE = 8;

interface HomePageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ params, searchParams }: HomePageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Fetch authenticated user (if logged in)
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  const navbarUser = user ? {
    email: user.email,
    avatar_url: user.user_metadata?.avatar_url,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name,
  } : null;
  const searchValues = await searchParams;
  const currentPage = Math.max(1, parseInt(searchValues.page ?? '1', 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const activeCategory = searchValues.category;
  const activeSearch = searchValues.q;
  const hasFilters = !!(activeCategory || activeSearch);

  // Fetch featured properties (not paginated - only show 2)
  let featuredProperties: Property[] = [];
  if (!hasFilters) {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: true })
      .limit(2);
    
    if (data) featuredProperties = data;
  }

  // Fetch paginated "New in Market" properties
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' });

  if (hasFilters) {
    if (activeCategory && activeCategory !== 'All') {
      // Assuming category matches PropertyCategory (e.g. house, apartment)
      query = query.ilike('category', activeCategory);
    }
    if (activeSearch) {
      query = query.or(`title.ilike.%${activeSearch}%,location.ilike.%${activeSearch}%`);
    }
  } else {
    query = query.eq('is_featured', false);
  }

  const { data: newInMarket, count } = await query
    .order('created_at', { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <>
      <Navbar dict={dict.navbar} user={navbarUser} lang={lang} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection dict={dict.hero} />

        {/* Featured Collections Section */}
        {!hasFilters && featuredProperties.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark">{dict.home.featuredCollections}</h2>
                <p className="text-nordic-muted mt-1 text-sm">{dict.home.featuredSubtitle}</p>
              </div>
              <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
                {dict.home.viewAll} <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map((property) => (
                <FeaturedPropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        {/* New in Market Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">{dict.home.newInMarket}</h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {dict.home.newSubtitle}
                {count != null && (
                  <span className="ml-2 text-mosque font-medium">{count} {dict.home.listings}</span>
                )}
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">{dict.hero.categories.all}</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">{dict.navbar.buy}</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">{dict.navbar.rent}</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(newInMarket as Property[])?.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Server-side Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
      </main>
    </>
  );
}
