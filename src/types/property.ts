export type PropertyType = "sale" | "rent";
export type PropertyCategory = "house" | "apartment" | "villa" | "penthouse";

/** Matches the `properties` table structure in Supabase */
export interface Property {
  id: string;
  title: string;
  slug?: string;
  location: string;
  price: number;
  price_label: string | null;
  type: PropertyType;
  category: PropertyCategory | null;
  beds: number;
  baths: number;
  area: number;
  images: string[];
  is_featured: boolean;
  tag: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
}

export interface PaginatedProperties {
  data: Property[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
