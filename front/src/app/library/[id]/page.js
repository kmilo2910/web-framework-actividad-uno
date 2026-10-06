import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import { formatCurrency } from '@/core/formatters/currency';
import PurchaseButton from '@/components/PurchaseButton';
import BookCover from '@/components/BookCover';
export const revalidate = 600;
async function getBook(id) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`, {
    next: { revalidate: 600, tags: [`book-${id}`] },
  });
  if (!response.ok) return null;
  return response.json();
}
export const dynamic = 'force-dynamic';
export default async function BookDetailPage({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book)
    return (
      <LibraryShell>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p>Publicación no encontrada.</p>
        </div>
      </LibraryShell>
    );
  return (
    <LibraryShell>
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
        <Link
          href="/library"
          className="flex items-center gap-2 text-sm font-semibold text-[#1f4f66]"
        >
          <ArrowLeft size={16} /> Volver a biblioteca
        </Link>
        <div className="mt-14 grid gap-12 md:grid-cols-[.7fr_1.3fr] md:items-center">
          <BookCover
            book={book}
            className="aspect-[3/4] rounded-3xl border border-[#b8d2d6] bg-gradient-to-br from-[#dbe8ea] via-[#f4f1eb] to-[#cbdde0] p-10 shadow-[0_20px_45px_rgba(31,79,102,0.14)] md:p-14"
            imageClassName="max-h-full w-auto max-w-full rounded-2xl object-contain drop-shadow-[0_16px_16px_rgba(23,32,42,0.24)]"
          />
          <div>
            <span className="rounded-full bg-[#e7eef0] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1f4f66]">
              {book.type === 'magazine' ? 'Revista' : 'Libro'}
            </span>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-.05em]">{book.title}</h1>
            <p className="mt-4 text-lg text-[#64707d]">
              {book.author} · {book.year}
            </p>
            <p className="mt-8 text-base leading-relaxed text-[#64707d]">
              {book.longDescription || book.shortDescription}
            </p>
            <p className="mt-8 text-3xl font-semibold">{formatCurrency(book.price)}</p>
            <PurchaseButton bookId={book.id} />
          </div>
        </div>
      </div>
    </LibraryShell>
  );
}
