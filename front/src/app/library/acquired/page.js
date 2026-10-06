'use client';
import { useEffect, useState } from 'react';
import LibraryShell from '@/components/LibraryShell';
import { apiClient } from '@/infrastructure/http/api.client';
import { formatCurrency } from '@/core/formatters/currency';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';
import Link from 'next/link';
import DownloadReceipt from '@/components/DownloadReceipt';
export default function AcquiredPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError('Debes iniciar sesión para ver tus adquisiciones');
        return;
      }
      apiClient
        .get('/api/purchases/mine')
        .then(async (purchases) => {
          const items = await Promise.all(
            purchases.map(async (purchase) => {
              try {
                const book = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/books/${purchase.bookId}`
                ).then((response) => response.json());
                return { ...purchase, book };
              } catch {
                return purchase;
              }
            })
          );
          setItems(items);
        })
        .catch((err) => setError(err.message));
    });
    return unsubscribe;
  }, []);
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">Área personal</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.06em]">Mis adquisiciones</h1>
        {error && <p className="mt-8 text-red-700">{error}</p>}
        {!error && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#d8d5ce] bg-white">
            {items.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-[#d8d5ce] bg-[#f8f7f4] text-xs uppercase tracking-wider text-[#64707d]">
                    <tr>
                      <th className="px-5 py-4">Publicación</th>
                      <th className="px-5 py-4">Autor</th>
                      <th className="px-5 py-4">Fecha</th>
                      <th className="px-5 py-4">Precio</th>
                      <th className="px-5 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#eeeae2] last:border-0 hover:bg-[#faf9f6]"
                      >
                        <td className="px-5 py-5 font-semibold">
                          <Link
                            className="text-[#1f4f66] hover:underline"
                            href={`/library/${item.bookId}`}
                          >
                            {item.book?.title || `Publicación ${item.bookId}`}
                          </Link>
                        </td>
                        <td className="px-5 py-5 text-[#64707d]">{item.book?.author || '—'}</td>
                        <td className="px-5 py-5 text-[#64707d]">
                          {new Date(item.purchasedAt).toLocaleDateString('es-CO')}
                        </td>
                        <td className="px-5 py-5 font-semibold">{formatCurrency(item.price)}</td>
                        <td className="px-5 py-5">
                          <DownloadReceipt purchase={item} book={item.book} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[#64707d]">Todavía no tienes adquisiciones.</p>
            )}
          </div>
        )}
      </div>
    </LibraryShell>
  );
}
