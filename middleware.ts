import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./src/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // If the URL has a locale, check if we need to update the cookie.
    const currentLocale = pathname.split('/')[1];
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

    const response = NextResponse.next();
    
    // Always sync the url locale to the cookie
    if (cookieLocale !== currentLocale) {
      response.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  }

  // Redirect if there is no locale
  // First, check if there is a cookie
  let locale = request.cookies.get('NEXT_LOCALE')?.value;

  // If no cookie or invalid cookie, use default
  if (!locale || !i18n.locales.includes(locale as any)) {
    locale = i18n.defaultLocale;
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  // Return redirect and set the cookie
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip api routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
