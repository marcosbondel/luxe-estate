'use client';

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg flex justify-center items-center text-mosque/50">Loading map...</div>,
});

export default function MapLoader() {
  return <PropertyMap />;
}
