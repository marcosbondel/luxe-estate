import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./src/lib/i18n";
import { updateSession } from "./src/lib/supabase/middleware";

// Matches /<locale>/admin or /<locale>/admin/...
const ADMIN_ROUTE_RE = /^\/[a-z]{2}\/admin(\/|$)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale redirect for auth callback, but still refresh session
  if (pathname.startsWith('/auth/')) {
    const { response } = await updateSession(request);
    return response;
  }

  // Refresh Supabase session (must run before any redirect so cookies stay fresh)
  const { response: supabaseResponse, userId } = await updateSession(request);

  // --- Admin route authentication guard ---
  // Role authorisation is handled inside the admin layout (server component).
  // Here we only ensure the user is authenticated at all.
  if (ADMIN_ROUTE_RE.test(pathname) && !userId) {
    const locale = pathname.split('/')[1];
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('next', pathname);
    const redirect = NextResponse.redirect(loginUrl);
    // Forward auth cookies so the session cookie isn't lost
    supabaseResponse.cookies.getAll().forEach((c) =>
      redirect.cookies.set(c.name, c.value)
    );
    return redirect;
  }

  // --- i18n locale handling ---
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const currentLocale = pathname.split('/')[1];
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

    if (cookieLocale !== currentLocale) {
      supabaseResponse.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return supabaseResponse;
  }

  // Redirect to locale-prefixed URL when locale is missing
  let locale = request.cookies.get('NEXT_LOCALE')?.value;
  if (!locale || !i18n.locales.includes(locale as any)) {
    locale = i18n.defaultLocale;
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
