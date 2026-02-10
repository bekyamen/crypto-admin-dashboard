import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  // All routes are now public - no authentication required
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};


