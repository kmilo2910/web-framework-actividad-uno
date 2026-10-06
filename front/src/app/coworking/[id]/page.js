import Link from 'next/link';
import { ArrowLeft, Coffee } from 'lucide-react';
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
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
        <Link
          href="/coworking"
          className="flex items-center gap-2 text-sm font-semibold text-[#1f4f66]"
        >
          <ArrowLeft size={16} /> Volver a coworking
        </Link>
        <div className="mt-14 rounded-3xl bg-[#1f4f66] p-8 text-[#f4f1eb] md:p-14">
          <Coffee size={36} />
          <div className="mt-6">
            <SpaceStatus space={space} />
          </div>
          <h1 className="mt-12 text-5xl font-semibold tracking-[-.05em]">{space.name}</h1>
          <p className="mt-5 text-lg text-[#dbe8ea]">
            Capacidad para {space.capacity} personas · Planta {space.floor}
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-[#dbe8ea]">
            Un espacio diseñado para concentrarte, colaborar y trabajar con comodidad, con
            mobiliario universitario y ambiente de estudio.
          </p>
          <div className="mt-10">
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
    </LibraryShell>
  );
}
