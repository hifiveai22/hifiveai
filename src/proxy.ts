import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'https';

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  if (host !== 'www.hifiveai.co' || proto === 'http') {
    const destination = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      'https://www.hifiveai.co'
    );
    return NextResponse.redirect(destination, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|og-image.png).*)',
  ],
};
