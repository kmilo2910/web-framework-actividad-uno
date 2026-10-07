import { NextResponse } from 'next/server';
import { getSpace } from '@/server/spaces';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const language = request.nextUrl.searchParams.get('lang') || 'es';
    const space = await getSpace((await params).id, language);
    return space
      ? NextResponse.json(space)
      : NextResponse.json({ error: 'Espacio no encontrado' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'No se pudo cargar el espacio' }, { status: 500 });
  }
}
