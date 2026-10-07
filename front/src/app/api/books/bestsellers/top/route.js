import { NextResponse } from 'next/server';
import { listBestsellers } from '@/server/books';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await listBestsellers(10));
  } catch {
    return NextResponse.json({ error: 'No se pudieron cargar los más vendidos' }, { status: 500 });
  }
}
