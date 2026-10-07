'use client';

import Link from 'next/link';
import { BookOpen, LogOut, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import LanguageSelector from '@/i18n/LanguageSelector';
import { useI18n } from '@/i18n/provider';

export default function LibraryShell({ children, user }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: auth0User } = useUser();
  const [activeUser, setActiveUser] = useState(user || null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { dictionary } = useI18n();
  const logoutText = dictionary.logout;
  useEffect(() => setActiveUser(auth0User || user || null), [auth0User, user]);
  const homePath = activeUser ? '/dashboard' : '/';
  const isAcquiredActive = pathname === '/library/acquired';
  const isLibraryActive =
    pathname === '/library' || (pathname.startsWith('/library/') && !isAcquiredActive);
  const isCoworkingActive = pathname === '/coworking' || pathname.startsWith('/coworking/');
  const isReservationsActive = pathname === '/coworking/reservations';
  const navLinkClass = (active, green = false) =>
    `hidden rounded-full px-3 py-2 transition md:block ${active ? (green ? 'bg-[#e8f3eb] font-semibold text-[#2f6f4e]' : 'bg-[#e7eef0] font-semibold text-[#1f4f66]') : 'hover:bg-white'}`;

  async function confirmLogout() {
    setLoggingOut(true);
    try {
      window.location.assign('/auth/logout');
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
        <header className="sticky top-0 z-40 border-b border-[#d8d5ce]/80 bg-[#f4f1eb]/90 px-6 py-3 backdrop-blur-xl md:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <Link href={homePath} className="flex items-center gap-3 font-semibold tracking-tight">
              <span
                className={`grid h-10 w-10 place-items-center rounded-2xl text-white shadow-sm ${isCoworkingActive ? 'bg-[#2f6f4e]' : 'bg-[#1f4f66]'}`}
              >
                <BookOpen size={18} />
              </span>
              <span>
                <span className="block text-base leading-none">Nexus</span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[.18em] text-[#64707d]">
                  Campus digital
                </span>
              </span>
            </Link>
            <nav className="flex items-center gap-2 text-sm text-[#64707d] md:gap-5">
              <Link className={`${navLinkClass(isLibraryActive)} font-medium`} href="/library">
                {dictionary.dashboard.library}
              </Link>
              {activeUser && (
                <Link className={navLinkClass(isAcquiredActive)} href="/library/acquired">
                  {dictionary.dashboard.acquisitions}
                </Link>
              )}
              <Link
                className={navLinkClass(isCoworkingActive && !isReservationsActive, true)}
                href="/coworking"
              >
                {dictionary.dashboard.coworking}
              </Link>
              {activeUser && (
                <Link
                  className={navLinkClass(isReservationsActive, true)}
                  href="/coworking/reservations"
                >
                  {dictionary.dashboard.reservations}
                </Link>
              )}
              {activeUser && (
                <span className="hidden items-center gap-2 rounded-full border border-[#d8d5ce] bg-white/70 px-3 py-2 md:flex">
                  {activeUser.photoURL || activeUser.avatar ? (
                    <img
                      src={activeUser.photoURL || activeUser.avatar}
                      alt={`Foto de ${activeUser.displayName || activeUser.name || 'usuario'}`}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#e7eef0] text-[#1f4f66]">
                      <UserRound size={14} />
                    </span>
                  )}
                  <span className="max-w-32 truncate text-xs font-semibold text-[#17202a]">
                    {activeUser.displayName || activeUser.name}
                  </span>
                </span>
              )}
              <LanguageSelector />
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
                {logoutText.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64707d]">
                {logoutText.description}
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className="rounded-full border border-[#d8d5ce] px-5 py-2.5 text-sm font-semibold text-[#64707d] transition hover:bg-[#f4f1eb] disabled:opacity-50"
                >
                  {dictionary.common.cancel}
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  disabled={loggingOut}
                  className="rounded-full bg-[#1f4f66] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173b4d] disabled:cursor-wait disabled:opacity-60"
                >
                  {loggingOut ? logoutText.closing : logoutText.confirm}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
