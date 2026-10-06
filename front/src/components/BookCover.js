'use client';

import { useState } from 'react';

export default function BookCover({ book, className = '', imageClassName = '' }) {
  const [loading, setLoading] = useState(Boolean(book.coverUrl));
  const [failed, setFailed] = useState(!book.coverUrl);
  const source = `${process.env.NEXT_PUBLIC_API_URL}/api/books/${book.id}/cover`;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {loading && !failed && (
        <div
          className="absolute inset-5 animate-pulse rounded-2xl bg-[#cbdde0]"
          aria-hidden="true"
        />
      )}
      <img
        src={failed ? '/book-placeholder.svg' : source}
        alt={failed ? 'Portada no disponible' : `Portada de ${book.title}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
        className={`relative z-10 max-h-full max-w-full rounded-2xl object-contain shadow-lg transition duration-500 ${
          failed ? 'h-full w-full' : imageClassName
        }`}
      />
    </div>
  );
}
