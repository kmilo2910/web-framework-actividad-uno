'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';
import { apiClient } from '@/infrastructure/http/api.client';
import Link from 'next/link';
export default function PersonalStats() {
  const [purchases, setPurchases] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      apiClient
        .get('/api/purchases/mine')
        .then(setPurchases)
        .catch(() => setPurchases([]));
    });
    return unsubscribe;
  }, []);
  return (
    <Link
      href="/library/acquired"
      className="group rounded-2xl border border-[#d8d5ce] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="text-sm text-[#64707d]">Tu biblioteca</p>
      <p className="mt-2 text-xl font-semibold">
        {purchases === null
          ? 'Cargando...'
          : `${purchases.length} ${purchases.length === 1 ? 'adquisición' : 'adquisiciones'}`}
      </p>
      <span className="mt-5 inline-flex rounded-full bg-[#1f4f66] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#173b4d]">
        Ver adquisiciones
      </span>
    </Link>
  );
}
