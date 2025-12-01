import { NextResponse } from 'next/server'

export function middleware(request) {
  const host = request.headers.get('host')
  
  // Only redirect www in production
  if (process.env.NODE_ENV === 'production' && host?.startsWith('www.')) {
    const newHost = host.replace('www.', '')
    const url = request.nextUrl.clone()
    url.host = newHost
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}