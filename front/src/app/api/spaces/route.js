import { NextResponse } from 'next/server';
import { listSpaces } from '@/server/spaces';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const language = request.nextUrl.searchParams.get('lang') || 'es';
    return NextResponse.json(await listSpaces(language));
  } catch {
    return NextResponse.json({ error: 'No se pudieron cargar los espacios' }, { status: 500 });
  }
}
