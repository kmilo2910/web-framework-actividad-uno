'use client';

import Link from 'next/link';
import { BookOpen, LogOut, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseAuthAdapter } from '@/infrastructure/firebase/firebase.client';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LibraryShell({ children, user }) {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState(user || null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => onAuthStateChanged(auth, setActiveUser), [user]);
  const homePath = activeUser ? '/dashboard' : '/';

  async function confirmLogout() {
    setLoggingOut(true);
    try {
      await firebaseAuthAdapter.logout();
      setActiveUser(null);
      setShowLogoutModal(false);
      router.replace('/login');
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <ProtectedRoute>
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
              {activeUser && <Link href="/library/acquired">Adquisiciones</Link>}
              <Link href="/coworking">Coworking</Link>
              {activeUser && <Link href="/coworking/reservations">Reservas</Link>}
              {activeUser && (
                <span className="hidden items-center gap-2 md:flex">
                  <UserRound size={16} />
                  {activeUser.displayName || activeUser.name}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                aria-label="Cerrar sesión"
                className="transition hover:text-[#1f4f66]"
              >
                <LogOut size={17} />
              </button>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        {showLogoutModal && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#17202a]/45 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
              <h2 id="logout-title" className="text-2xl font-semibold text-[#17202a]">
                ¿Deseas cerrar sesión?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64707d]">
                Se eliminarán los datos de tu sesión en este dispositivo y tendrás que volver a
                iniciar sesión para acceder a Nexus.
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className="rounded-full border border-[#d8d5ce] px-5 py-2.5 text-sm font-semibold text-[#64707d] transition hover:bg-[#f4f1eb] disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  disabled={loggingOut}
                  className="rounded-full bg-[#1f4f66] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173b4d] disabled:cursor-wait disabled:opacity-60"
                >
                  {loggingOut ? 'Cerrando sesión...' : 'Sí, cerrar sesión'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
