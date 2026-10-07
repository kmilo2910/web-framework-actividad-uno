'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiClient } from '@/infrastructure/http/api.client';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
export default function PersonalStats() {
  const { user } = useUser();
  const [purchases, setPurchases] = useState(null);
  useEffect(() => {
    if (!user) return;
    apiClient.get('/api/purchases/mine').then(setPurchases).catch(() => setPurchases([]));
  }, [user]);
  return (
    <Link
      href="/library/acquired"
      className="group flex min-h-44 flex-col rounded-2xl border border-[#d8d5ce] bg-white p-5 text-[#17202a] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-[#1f4f66] hover:bg-[#1f4f66] hover:text-[#f4f1eb] hover:shadow-lg"
    >
      <BookOpen className="text-[#1f4f66] transition-colors duration-300 group-hover:text-[#f4f1eb]" />
      <p className="mt-5 text-sm text-[#64707d] transition-colors duration-300 group-hover:text-[#dbe8ea]">
        Tu biblioteca
      </p>
      <p className="mt-2 min-h-7 text-xl font-semibold transition-colors duration-300 group-hover:text-white">
        {purchases === null
          ? 'Cargando...'
          : `${purchases.length} ${purchases.length === 1 ? 'adquisición' : 'adquisiciones'}`}
      </p>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1f4f66] transition-colors duration-300 group-hover:text-white">
        Ver adquisiciones{' '}
        <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
