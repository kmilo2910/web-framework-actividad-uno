'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';
export default function SpaceStatus({ space }) {
  const [email, setEmail] = useState(null);
  useEffect(() => onAuthStateChanged(auth, (user) => setEmail(user?.email || null)), []);
  const own = email && space.occupiedByEmail && email === space.occupiedByEmail;
  if (space.status === 'available')
    return (
      <span className="rounded-full bg-[#e8f3eb] px-3 py-1 text-xs font-semibold text-[#2f6f4e]">
        Disponible
      </span>
    );
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        own ? 'bg-[#e8eefc] text-[#315a9b]' : 'bg-[#fff1e7] text-[#a4511f]'
      }`}
    >
      {own ? 'Reservado por ti' : 'Ocupado'}
    </span>
  );
}
