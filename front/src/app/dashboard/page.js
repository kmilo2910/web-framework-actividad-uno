import Link from 'next/link';
import { ArrowUpRight, BookOpen, Coffee, Library, UsersRound } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import PersonalStats from '@/components/PersonalStats';

export default function DashboardPage() {
  return (
    <LibraryShell>
      <div className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:min-h-[calc(100vh-69px)] lg:py-6">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">
            Área personal
          </p>
          <h1 className="text-4xl font-semibold tracking-[-.06em] md:text-5xl lg:text-[3.4rem]">
            Tu campus, conectado.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#64707d] md:text-lg">
            Continúa explorando recursos, encuentra un espacio para trabajar y organiza tu tiempo.
          </p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <Link
            href="/library"
            className="group flex min-h-48 flex-col rounded-3xl border border-[#d8d5ce] bg-white p-6 text-[#17202a] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-[#1f4f66] hover:bg-[#1f4f66] hover:text-[#f4f1eb] hover:shadow-xl md:p-7 lg:min-h-44"
          >
            <div className="flex items-start justify-between text-[#1f4f66] transition-colors duration-300 group-hover:text-[#f4f1eb]">
              <BookOpen size={28} />
              <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <h2 className="mt-auto pt-10 text-3xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-white">
              Biblioteca
            </h2>
            <p className="mt-2 max-w-sm text-[#64707d] transition-colors duration-300 group-hover:text-[#dbe8ea]">
              Explora libros y revistas del catálogo
              <br />
              universitario.
            </p>
            <span className="mt-5 inline-flex w-fit items-center rounded-full bg-[#1f4f66] px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#1f4f66]">
              Explorar biblioteca
            </span>
          </Link>
          <Link
            href="/coworking"
            className="group flex min-h-48 flex-col rounded-3xl border border-[#d8d5ce] bg-white p-6 text-[#17202a] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-[#1f4f66] hover:bg-[#1f4f66] hover:text-[#f4f1eb] hover:shadow-xl md:p-7 lg:min-h-44"
          >
            <div className="flex items-start justify-between text-[#1f4f66] transition-colors duration-300 group-hover:text-[#f4f1eb]">
              <Coffee size={28} />
              <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <h2 className="mt-auto pt-10 text-3xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-white">
              Coworking
            </h2>
            <p className="mt-2 max-w-sm text-[#64707d] transition-colors duration-300 group-hover:text-[#dbe8ea]">
              Consulta espacios disponibles y gestiona tus reservas.
            </p>
            <span className="mt-5 inline-flex w-fit items-center rounded-full bg-[#1f4f66] px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#1f4f66]">
              Ver espacios
            </span>
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <PersonalStats />
          <Link
            href="/coworking/reservations"
            className="group flex min-h-44 flex-col rounded-2xl border border-[#d8d5ce] bg-white p-5 text-[#17202a] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-[#1f4f66] hover:bg-[#1f4f66] hover:text-[#f4f1eb] hover:shadow-lg"
          >
            <UsersRound className="text-[#1f4f66] transition-colors duration-300 group-hover:text-[#f4f1eb]" />
            <p className="mt-5 text-sm text-[#64707d] transition-colors duration-300 group-hover:text-[#dbe8ea]">
              Tus reservas
            </p>
            <p className="mt-2 min-h-7 text-xl font-semibold transition-colors duration-300 group-hover:text-white">
              0 espacios reservados
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1f4f66] transition-colors duration-300 group-hover:text-white">
              Ver reservas{' '}
              <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </LibraryShell>
  );
}
