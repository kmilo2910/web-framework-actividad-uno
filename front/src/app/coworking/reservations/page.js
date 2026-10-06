'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LibraryShell from '@/components/LibraryShell';
import { apiClient } from '@/infrastructure/http/api.client';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';
import CancelReservationButton from '@/components/CancelReservationButton';
import { CalendarDays, Clock3, Timer } from 'lucide-react';
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
                className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#b9d8c5]/60 bg-white/75 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-[#17202a]">
                      {item.spaceName || item.spaceId}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'active'
                          ? 'bg-[#e8f3eb] text-[#2f6f4e]'
                          : 'bg-[#fff1eb] text-[#a4511f]'
                      }`}
                    >
                      {item.status === 'active' ? 'Activa' : 'Cancelada'}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#334155]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3eb] px-3 py-1.5">
                      <CalendarDays size={14} className="text-[#2f6f4e]" />
                      {new Date(item.startsAt).toLocaleDateString('es-CO')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3eb] px-3 py-1.5">
                      <Clock3 size={14} className="text-[#2f6f4e]" />
                      {new Date(item.startsAt).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      —{' '}
                      {new Date(item.endsAt).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3eb] px-3 py-1.5">
                      <Timer size={14} className="text-[#2f6f4e]" />
                      {Math.round((new Date(item.endsAt) - new Date(item.startsAt)) / 60000)}{' '}
                      minutos
                    </span>
                  </div>
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
