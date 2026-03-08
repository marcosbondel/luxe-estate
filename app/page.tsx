import React from 'react';
import Navbar from '../src/components/Navbar';
import HeroSection from '../src/components/HeroSection';
import FeaturedPropertyCard from '../src/components/FeaturedPropertyCard';
import PropertyCard from '../src/components/PropertyCard';
import Pagination from '../src/components/Pagination';
import { supabase } from '../src/lib/supabase';
import type { Property } from '../src/types/property';

const PAGE_SIZE = 8;

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Fetch featured properties (not paginated - always show all)
  const { data: featuredProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: true });

  // Fetch paginated "New in Market" properties with total count
  const { data: newInMarket, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />

        {/* Featured Collections Section */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">Featured Collections</h2>
              <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
            </div>
            <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
              View all <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(featuredProperties as Property[])?.map((property) => (
              <FeaturedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* New in Market Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">New in Market</h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Fresh opportunities added this week.
                {count != null && (
                  <span className="ml-2 text-mosque font-medium">{count} listings</span>
                )}
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">All</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">Buy</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">Rent</button>
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
