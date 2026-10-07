import { NextResponse } from 'next/server';
import { listBooks } from '@/server/books';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await listBooks());
  } catch {
    return NextResponse.json({ error: 'No se pudo cargar el catálogo' }, { status: 500 });
  }
}
