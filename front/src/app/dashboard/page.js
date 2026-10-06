import Link from 'next/link';
import { ArrowUpRight, BookOpen, Coffee, Library, UsersRound } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import PersonalStats from '@/components/PersonalStats';

export default function DashboardPage() {
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">
            Área personal
          </p>
          <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-7xl">
            Todo tu campus, en un solo lugar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#64707d]">
            Continúa explorando recursos, encuentra un espacio para trabajar y organiza tu tiempo.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Link
            href="/library"
            className="group rounded-3xl bg-[#1f4f66] p-7 text-[#f4f1eb] transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <BookOpen size={28} />
              <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <h2 className="mt-20 text-3xl font-semibold tracking-tight">Biblioteca</h2>
            <p className="mt-2 max-w-sm text-[#dbe8ea]">
              Explora libros y revistas del catálogo universitario.
            </p>
            <span className="mt-7 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1f4f66]">
              Ingresar a biblioteca
            </span>
          </Link>
          <Link
            href="/coworking"
            className="group rounded-3xl border border-[#d8d5ce] bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between text-[#1f4f66]">
              <Coffee size={28} />
              <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <h2 className="mt-20 text-3xl font-semibold tracking-tight">Coworking</h2>
            <p className="mt-2 max-w-sm text-[#64707d]">
              Consulta espacios disponibles y gestiona tus reservas.
            </p>
            <span className="mt-7 inline-flex items-center rounded-full bg-[#1f4f66] px-4 py-2 text-sm font-semibold text-white">
              Ingresar a coworking
            </span>
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <PersonalStats />
          <div className="rounded-2xl border border-[#d8d5ce] bg-white p-6">
            <UsersRound className="text-[#1f4f66]" />
            <p className="mt-8 text-sm text-[#64707d]">Tus reservas</p>
            <p className="mt-1 text-xl font-semibold">0 espacios reservados</p>
          </div>
        </div>
      </div>
    </LibraryShell>
  );
}
