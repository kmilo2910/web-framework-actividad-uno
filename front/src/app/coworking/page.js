import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Coffee } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import ReserveButton from '@/components/ReserveButton';
import SpaceStatus from '@/components/SpaceStatus';
export const dynamic = 'force-dynamic';
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
          className="flex items-center gap-2 text-sm font-semibold text-[#1f4f66]"
        >
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>
        <div className="mt-14 max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">
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
        <div className="mt-10 rounded-2xl border border-[#b8d2d6] bg-[#e7eef0] p-5 text-sm leading-relaxed text-[#1f4f66]">
          <strong>¿Cómo funcionan las reservas?</strong>
          <p className="mt-2">
            Elige una fecha, una hora de inicio y un bloque de 15, 30, 45 o 60 minutos. Los espacios
            ocupados muestran su hora de liberación. Puedes cancelar hasta 30 minutos antes de que
            comience la reserva; después de ese momento la cancelación queda bloqueada. El horario
            es de lunes a viernes, de 08:00 a 20:00.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="nexus-card">
            <p className="nexus-label">Concentración</p>
            <p className="mt-2 font-semibold">
              Espacios pensados para trabajar sin interrupciones.
            </p>
          </div>
          <div className="nexus-card">
            <p className="nexus-label">Colaboración</p>
            <p className="mt-2 font-semibold">Salas adaptadas para equipos y proyectos.</p>
          </div>
          <div className="nexus-card">
            <p className="nexus-label">Flexibilidad</p>
            <p className="mt-2 font-semibold">Reserva por bloques de 15, 30, 45 o 60 minutos.</p>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {spaces.map((space) => (
            <article
              key={space.id}
              className="rounded-3xl border border-[#d8d5ce] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e7eef0] text-[#1f4f66]">
                  <Coffee size={21} />
                </span>
                <SpaceStatus space={space} />
              </div>
              <h2 className="mt-12 text-2xl font-semibold">{space.name}</h2>
              <p className="mt-2 text-sm text-[#64707d]">
                Capacidad para {space.capacity} personas · Planta {space.floor}
              </p>
              {space.status === 'occupied' && (
                <p className="mt-2 text-xs text-[#a4511f]">
                  Disponible{' '}
                  {new Date(space.availableAt).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/coworking/${space.id}`}
                  className="flex items-center gap-2 text-sm font-semibold text-[#1f4f66]"
                >
                  Ver espacio <ArrowUpRight size={16} />
                </Link>
                <ReserveButton
                  spaceId={space.id}
                  disabled={space.status !== 'available'}
                  availableAt={space.availableAt}
                  occupiedFrom={space.occupiedFrom}
                  occupiedByEmail={space.occupiedByEmail}
                  reservationId={space.reservationId}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </LibraryShell>
  );
}
