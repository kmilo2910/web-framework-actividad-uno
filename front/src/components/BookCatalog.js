'use client';
import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import BookCard from '@/components/BookCard';
export default function BookCatalog({ books }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const categories = [...new Set(books.map((book) => book.category))];
  const years = [...new Set(books.map((book) => book.year))].sort((a, b) => b - a);
  const visible = useMemo(
    () =>
      books.filter(
        (book) =>
          `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()) &&
          (!type || book.type === type) &&
          (!category || book.category === category) &&
          (!year || String(book.year) === year)
      ),
    [books, query, type, category, year]
  );
  return (
    <>
      <div className="mt-14 flex flex-col gap-3 border-y border-[#d8d5ce] py-4 md:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3">
          <Search size={18} className="text-[#64707d]" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Buscar por título o autor"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-[#d8d5ce] bg-white px-4 py-3 text-sm">
          <SlidersHorizontal size={17} />
          <select
            className="bg-transparent outline-none"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="book">Libros</option>
            <option value="magazine">Revistas</option>
          </select>
        </label>
        <select
          className="rounded-xl border border-[#d8d5ce] bg-white px-4 py-3 text-sm outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Categorías</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="rounded-xl border border-[#d8d5ce] bg-white px-4 py-3 text-sm outline-none"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Año</option>
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
}
