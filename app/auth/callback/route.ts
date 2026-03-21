import { NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'
import { createAdminClient } from '@/src/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Upsert user profile into user_roles.
      // Wrapped in try/catch so a missing env var or unapplied migration
      // never breaks the auth redirect.
      try {
        const adminClient = createAdminClient()
        await adminClient
          .from('user_roles')
          .upsert(
            {
              user_id: data.user.id,
              email: data.user.email ?? null,
              full_name:
                data.user.user_metadata?.full_name ??
                data.user.user_metadata?.name ??
                null,
              avatar_url: data.user.user_metadata?.avatar_url ?? null,
              // 'role' defaults to 'user' on first insert; never overwrite on upsert
            },
            { onConflict: 'user_id', ignoreDuplicates: false }
          )
          .select('id')
      } catch (upsertErr) {
        // Log but don't block authentication
        console.error('[auth/callback] user_roles upsert failed:', upsertErr)
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
