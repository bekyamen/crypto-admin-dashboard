import { NextRequest, NextResponse } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/login', '/']

// Routes that require authentication
const protectedRoutes = ['/dashboard']

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('authToken')?.value

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/' && token) {
    // Redirect to dashboard if accessing home with valid token
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/login' && token) {
    // Redirect to dashboard if already logged in
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
