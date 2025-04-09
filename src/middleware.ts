import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')?.value

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/spot')

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login' , request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/spot'],
}
