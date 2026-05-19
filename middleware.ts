import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./src/lib/i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth/')) {
    return NextResponse.next({ request });
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const currentLocale = pathname.split('/')[1];
    const response = NextResponse.next({ request });
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale !== currentLocale) {
      response.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return response;
  }

  let locale = request.cookies.get('NEXT_LOCALE')?.value;
  if (!locale || !i18n.locales.includes(locale as any)) {
    locale = i18n.defaultLocale;
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
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
