import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_API_URL;

async function proxy(request, { params }) {
  if (!backendUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL no está configurada' }, { status: 500 });
  }

  const { path } = await params;
  const target = new URL(`/api/${path.join('/')}`, backendUrl);
  target.search = new URL(request.url).search;

  const headers = new globalThis.Headers();
  for (const name of ['accept', 'authorization', 'content-type', 'cookie']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const options = { method: request.method, headers, redirect: 'follow' };
  if (!['GET', 'HEAD'].includes(request.method)) options.body = await request.arrayBuffer();

  try {
    const response = await fetch(target, options);
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json({ error: 'No fue posible conectar con la API' }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
