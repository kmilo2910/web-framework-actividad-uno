import Link from 'next/link';

export default async function Bestsellers() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/bestsellers/top`, {
    next: { revalidate: 300, tags: ['bestsellers'] },
  });
  const books = response.ok ? (await response.json()).slice(0, 3) : [];
  return (
    <section className="mt-10 rounded-3xl bg-[#17202a] p-7 text-[#f4f1eb]">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#b8d2d6]">Más vendidos</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {books.map((book, index) => (
          <Link
            key={book.id}
            href={`/library/${book.id}`}
            className="border-t border-white/20 pt-4"
          >
            <span className="text-sm text-[#b8d2d6]">0{index + 1}</span>
            <h2 className="mt-5 font-semibold">{book.title}</h2>
            <p className="mt-1 text-sm text-white/60">{book.soldLastWeeks} ventas recientes</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
