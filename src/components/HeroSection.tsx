"use client";

import React, { useState, useEffect } from 'react';
import SearchFiltersModal from './SearchFiltersModal';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HeroSection({ dict }: { dict?: any }) {
  // Graceful fallback for dict to allow isolated testing if needed
  const t = dict || {
    findYour: "Find your", sanctuary: "sanctuary", searchPlaceholder: "Search by city, neighborhood, or address...", searchButton: "Search", categories: { all: "All", house: "House", apartment: "Apartment", villa: "Villa", penthouse: "Penthouse" }, filters: "Filters"
  };
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('q') || '';
  
  const [searchValue, setSearchValue] = useState(currentSearch);

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.delete('page');
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set('q', searchValue.trim());
    } else {
      params.delete('q');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`, { scroll: false });
  };
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          {t.findYour}{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">{t.sanctuary}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>
        
        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          </div>
          <input
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
            placeholder={t.searchPlaceholder}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20">
            {t.searchButton}
          </button>
        </form>

        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {['all', 'house', 'apartment', 'villa', 'penthouse'].map((catKey) => {
            const categoryLabel = t.categories?.[catKey as keyof typeof t.categories] || catKey;
            const originalCat = catKey.charAt(0).toUpperCase() + catKey.slice(1); // Keep the underlying value same for URL state
            return (
            <button
              key={catKey}
              onClick={() => handleCategoryClick(catKey === 'all' ? 'All' : originalCat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                currentCategory === (catKey === 'all' ? 'All' : originalCat)
                  ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10'
                  : 'bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5'
              }`}
            >
              {categoryLabel}
            </button>
            );
          })}
          <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
          >
            <span className="material-icons text-base">tune</span> {t.filters}
          </button>
        </div>
      </div>

      <SearchFiltersModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </section>
  );
}
