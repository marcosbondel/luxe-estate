import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client with the SERVICE_ROLE key.
 * Bypasses Row Level Security — use only in trusted server contexts
 * (Server Actions, Route Handlers, admin layout checks).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
