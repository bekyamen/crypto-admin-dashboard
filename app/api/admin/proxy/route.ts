import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_BASE =
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_UR ||
  'http://localhost:5000/api/admin';

export async function GET(req: NextRequest) {
  return proxy(req);
}
export async function POST(req: NextRequest) {
  return proxy(req);
}
export async function PUT(req: NextRequest) {
  return proxy(req);
}
export async function DELETE(req: NextRequest) {
  return proxy(req);
}

async function proxy(req: NextRequest) {
  const endpoint = req.nextUrl.searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json(
      { success: false, message: 'Missing endpoint parameter' },
      { status: 400 }
    );
  }

  const token = req.headers.get('authorization');

  const res = await fetch(`${ADMIN_API_BASE}${endpoint}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    body:
      req.method === 'GET'
        ? undefined
        : JSON.stringify(await req.json()),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
