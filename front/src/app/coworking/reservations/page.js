'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LibraryShell from '@/components/LibraryShell';
import { apiClient } from '@/infrastructure/http/api.client';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';
import CancelReservationButton from '@/components/CancelReservationButton';
export default function ReservationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) apiClient.get('/api/reservations/mine').then(setItems);
    });
    return unsubscribe;
  }, []);
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <Link href="/coworking" className="text-sm font-semibold text-[#1f4f66]">
          ← Volver a coworking
        </Link>
        <h1 className="mt-8 text-5xl font-semibold tracking-[-.06em]">Mis reservas</h1>
        <div className="mt-10 grid gap-4">
          {items.length ? (
            items.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d8d5ce] bg-white p-5"
              >
                <div>
                  <p className="font-semibold">Espacio {item.spaceId}</p>
                  <p className="mt-2 text-sm text-[#64707d]">
                    {new Date(item.startsAt).toLocaleString('es-CO')} —{' '}
                    {new Date(item.endsAt).toLocaleTimeString('es-CO')}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-[#64707d]">
                    {item.status === 'active' ? 'Activa' : 'Cancelada'}
                  </p>
                </div>
                {item.status === 'active' && (
                  <CancelReservationButton
                    reservationId={item.id}
                    onCancelled={(id) =>
                      setItems((current) =>
                        current.map((reservation) =>
                          reservation.id === id
                            ? { ...reservation, status: 'cancelled' }
                            : reservation
                        )
                      )
                    }
                  />
                )}
              </article>
            ))
          ) : (
            <p className="text-[#64707d]">Todavía no tienes reservas.</p>
          )}
        </div>
      </div>
    </LibraryShell>
  );
}
