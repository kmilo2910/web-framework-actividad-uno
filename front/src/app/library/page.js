import LibraryShell from '@/components/LibraryShell';
import BookCatalog from '@/components/BookCatalog';
import Bestsellers from '@/components/Bestsellers';
import LibraryIntro from '@/components/LibraryIntro';
import { cookies } from 'next/headers';
import { normalizeLanguage } from '@/i18n/config';
import LibraryBackLink from '@/components/LibraryBackLink';
export const dynamic = 'force-dynamic';
async function getBooks(language) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books?lang=${language}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('No se pudo cargar el catálogo');
  return response.json();
}
export default async function LibraryPage() {
  const language = normalizeLanguage((await cookies()).get('nexus-locale')?.value);
  const books = await getBooks(language);
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <LibraryBackLink href="/dashboard" labelKey="backToDashboard" />
        <LibraryIntro />
        <Bestsellers />
        <BookCatalog books={books} />
      </div>
    </LibraryShell>
  );
}
