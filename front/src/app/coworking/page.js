import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Star } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import ReserveButton from '@/components/ReserveButton';
import SpaceStatus from '@/components/SpaceStatus';
export const dynamic = 'force-dynamic';

function RatingStars({ rating }) {
  const value = Number(rating);
  const safeRating = Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;

  return (
    <span
      className="flex items-center gap-1 rounded-2xl bg-[#fff7df] px-3 py-2 text-[#c58a16]"
      aria-label={`Calificación ${safeRating} de 5 estrellas`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fillPercentage = Math.max(0, Math.min(1, safeRating - index)) * 100;

        return (
          <span key={index} className="relative block h-[14px] w-[14px]">
            <Star size={14} className="absolute inset-0" fill="transparent" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star size={14} className="block max-w-none" fill="currentColor" />
            </span>
          </span>
        );
      })}
      <span className="ml-1 text-xs font-bold">{safeRating || '—'}</span>
    </span>
  );
}

async function getSpaces() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spaces`, {
    cache: 'no-store',
  });
  return response.ok ? response.json() : [];
}
export default async function CoworkingPage() {
  const spaces = await getSpaces();
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-[#2f6f4e]"
        >
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>
        <div className="mt-14 max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#2f6f4e]">
            Coworking universitario
          </p>
          <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-7xl">
            Encuentra tu lugar para concentrarte.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#64707d]">
            Consulta la disponibilidad de los espacios y reserva el que mejor se adapte a tu
            jornada.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-[#b9d8c5] bg-[#e8f3eb] p-5 text-sm leading-relaxed text-[#2f6f4e]">
          <strong>¿Cómo funcionan las reservas?</strong>
          <p className="mt-2">
            Elige una fecha, una hora de inicio y un bloque de 15, 30, 45 o 60 minutos. Los espacios
            ocupados muestran su hora de liberación. Puedes cancelar hasta 30 minutos antes de que
            comience la reserva; después de ese momento la cancelación queda bloqueada. El horario
            es de lunes a viernes, de 08:00 a 20:00.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="nexus-card !border-[#b9d8c5]/60 !bg-[#e8f3eb]/55 shadow-sm backdrop-blur-sm">
            <p className="nexus-label !text-[#2f6f4e]">Concentración</p>
            <p className="mt-2 font-semibold">
              Espacios pensados para trabajar sin interrupciones.
            </p>
          </div>
          <div className="nexus-card !border-[#b9d8c5]/60 !bg-[#e8f3eb]/55 shadow-sm backdrop-blur-sm">
            <p className="nexus-label !text-[#2f6f4e]">Colaboración</p>
            <p className="mt-2 font-semibold">Salas adaptadas para equipos y proyectos.</p>
          </div>
          <div className="nexus-card !border-[#b9d8c5]/60 !bg-[#e8f3eb]/55 shadow-sm backdrop-blur-sm">
            <p className="nexus-label !text-[#2f6f4e]">Flexibilidad</p>
            <p className="mt-2 font-semibold">Reserva por bloques de 15, 30, 45 o 60 minutos.</p>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {spaces.map((space) => (
            <article
              key={space.id}
              className="group relative overflow-hidden rounded-3xl border border-white/55 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-white/75 hover:shadow-lg"
            >
              {space.imageUrl && (
                <div
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.30] transition duration-500 group-hover:opacity-[0.38]"
                  style={{ backgroundImage: `url(${space.imageUrl})` }}
                  aria-hidden="true"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/45 via-white/65 to-white/95" />
              <div className="relative z-10 flex items-start justify-between">
                <RatingStars rating={space.rating} />
                <SpaceStatus space={space} />
              </div>
              <h2 className="relative z-10 mt-12 text-2xl font-semibold">{space.name}</h2>
              <p className="relative z-10 mt-2 text-sm text-[#64707d]">
                Capacidad para {space.capacity} personas · Planta {space.floor}
              </p>
              {space.status === 'occupied' && (
                <p className="relative z-10 mt-2 text-xs text-[#a4511f]">
                  Disponible{' '}
                  {new Date(space.availableAt).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              <div className="relative z-10 mt-7">
                <ReserveButton
                  spaceId={space.id}
                  detailHref={`/coworking/${space.id}`}
                  disabled={space.status !== 'available'}
                  availableAt={space.availableAt}
                  occupiedFrom={space.occupiedFrom}
                  occupiedByEmail={space.occupiedByEmail}
                  reservationId={space.reservationId}
                  light
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </LibraryShell>
  );
}
