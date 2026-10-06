import LibraryShell from '@/components/LibraryShell';
import BookDetailInfo from '@/components/BookDetailInfo';
import BookCover from '@/components/BookCover';
import LibraryBackLink from '@/components/LibraryBackLink';
import { cookies } from 'next/headers';
import { normalizeLanguage } from '@/i18n/config';
export const revalidate = 600;
async function getBook(id, language) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}?lang=${language}`,
    { cache: 'no-store' }
  );
  if (!response.ok) return null;
  return response.json();
}
export const dynamic = 'force-dynamic';
export default async function BookDetailPage({ params }) {
  const { id } = await params;
  const language = normalizeLanguage((await cookies()).get('nexus-locale')?.value);
  const book = await getBook(id, language);
  if (!book)
    return (
      <LibraryShell>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p>Publication not found.</p>
        </div>
      </LibraryShell>
    );
  return (
    <LibraryShell>
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
        <LibraryBackLink />
        <div className="mt-14 grid gap-12 md:grid-cols-[.7fr_1.3fr] md:items-center">
          <BookCover
            book={book}
            className="aspect-[3/4] rounded-3xl border border-[#b8d2d6] bg-gradient-to-br from-[#dbe8ea] via-[#f4f1eb] to-[#cbdde0] p-10 shadow-[0_20px_45px_rgba(31,79,102,0.14)] md:p-14"
            imageClassName="max-h-full w-auto max-w-full rounded-2xl object-contain drop-shadow-[0_16px_16px_rgba(23,32,42,0.24)]"
          />
          <BookDetailInfo book={book} />
        </div>
      </div>
    </LibraryShell>
  );
}
