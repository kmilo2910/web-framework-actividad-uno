import LibraryShell from '@/components/LibraryShell';
import BookCatalog from '@/components/BookCatalog';
import Bestsellers from '@/components/Bestsellers';
export const dynamic = 'force-dynamic';
async function getBooks() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('No se pudo cargar el catálogo');
  return response.json();
}
export default async function LibraryPage() {
  const books = await getBooks();
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">
            Biblioteca universitaria
          </p>
          <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-7xl">
            Historias, ideas y conocimiento.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#64707d]">
            Explora nuestro catálogo y encuentra tu próxima lectura.
          </p>
        </div>
        <Bestsellers />
        <BookCatalog books={books} />
      </div>
    </LibraryShell>
  );
}
