'use client';

import Link from 'next/link';
import { BookOpen, LogOut, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';

export default function LibraryShell({ children, user }) {
  const [activeUser, setActiveUser] = useState(user || null);
  useEffect(() => onAuthStateChanged(auth, setActiveUser), [user]);
  const homePath = activeUser ? '/dashboard' : '/';
  return (
    <div className="min-h-screen bg-[#f4f1eb] text-[#17202a]">
      <header className="border-b border-[#d8d5ce] bg-[#f4f1eb]/90 px-6 py-5 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href={homePath} className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1f4f66] text-white">
              <BookOpen size={18} />
            </span>
            Nexus
          </Link>
          <nav className="flex items-center gap-5 text-sm text-[#64707d]">
            <Link className="font-medium text-[#17202a]" href="/library">
              Biblioteca
            </Link>
            <Link href="/coworking">Coworking</Link>
            {activeUser && (
              <span className="hidden items-center gap-2 md:flex">
                <UserRound size={16} />
                {activeUser.displayName || activeUser.name}
              </span>
            )}
            <Link href="/login" aria-label="Cerrar sesión">
              <LogOut size={17} />
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
