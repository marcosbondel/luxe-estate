"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '../lib/i18n';

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derive current locale from pathname
  const currentLocale = pathname.split('/')[1] as Locale || i18n.defaultLocale;

  const languages = {
    es: { name: 'Español', flag: '🇲🇽' },
    en: { name: 'English', flag: '🇺🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
  };

  const handleLanguageChange = (locale: Locale) => {
    // Replace the current locale in the pathname with the new one
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    
    setIsOpen(false);
    // Let the middleware handle cookie saving when redirecting
    router.push(newPath);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors text-nordic-dark font-medium text-sm"
      >
        <span>{languages[currentLocale]?.flag}</span>
        <span className="uppercase text-xs">{currentLocale}</span>
        <span className="material-icons text-base">expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-nordic-dark/10 overflow-hidden z-50">
          <div className="py-1">
            {i18n.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-mosque/5 transition-colors ${
                  currentLocale === locale ? 'text-mosque font-bold bg-mosque/5' : 'text-nordic-dark'
                }`}
              >
                <span>{languages[locale].flag}</span>
                <span>{languages[locale].name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
