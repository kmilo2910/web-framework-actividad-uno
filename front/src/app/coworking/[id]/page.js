import Link from 'next/link';
import { ArrowLeft, Building2, Coffee, Users } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import ReserveButton from '@/components/ReserveButton';
import SpaceStatus from '@/components/SpaceStatus';
export const dynamic = 'force-dynamic';
async function getSpace(id) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spaces/${id}`, {
    cache: 'no-store',
  });
  return response.ok ? response.json() : null;
}
export default async function SpaceDetailPage({ params }) {
  const space = await getSpace((await params).id);
  if (!space)
    return (
      <LibraryShell>
        <div className="mx-auto max-w-5xl px-6 py-20">Espacio no encontrado.</div>
      </LibraryShell>
    );
  return (
    <LibraryShell>
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <Link
          href="/coworking"
          className="inline-flex items-center gap-2 text-sm font-semibold leading-none text-[#2f6f4e]"
        >
          <ArrowLeft size={16} /> Volver a coworking
        </Link>
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/45 bg-[#2f6f4e]/90 text-[#f4f1eb] shadow-[0_18px_45px_rgba(47,111,78,0.16)]">
          {space.imageUrl && (
            <div
              className="h-32 bg-cover bg-center opacity-80 md:h-44"
              style={{ backgroundImage: `url(${space.imageUrl})` }}
            />
          )}
          <div className="p-4 md:p-6">
            <Coffee size={32} />
            <div className="mt-3">
              <SpaceStatus space={space} />
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-5xl">
              {space.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-[#f4f1eb]">
                <Users size={15} /> Capacidad: {space.capacity} personas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-[#f4f1eb]">
                <Building2 size={15} /> Planta {space.floor}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#dceee2]">
              {space.longDescription || space.shortDescription}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(space.benefits || []).map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm"
                >
                  {benefit}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/15 bg-black/10 p-3 md:p-4">
              <ReserveButton
                spaceId={space.id}
                disabled={space.status !== 'available'}
                availableAt={space.availableAt}
                occupiedFrom={space.occupiedFrom}
                occupiedByEmail={space.occupiedByEmail}
                reservationId={space.reservationId}
              />
            </div>
          </div>
        </div>
      </div>
    </LibraryShell>
  );
}
