import { NextResponse } from 'next/server';
import { getBook } from '@/server/books';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const book = await getBook((await params).id);
  return book
    ? NextResponse.json(book)
    : NextResponse.json({ error: 'Libro o revista no encontrado' }, { status: 404 });
}
