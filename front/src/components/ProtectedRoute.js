'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setChecking(false);

      if (!authenticatedUser) {
        const returnTo =
          pathname && pathname !== '/login' ? `?returnTo=${encodeURIComponent(pathname)}` : '';
        router.replace(`/login${returnTo}`);
      }
    });

    return unsubscribe;
  }, [pathname, router]);

  if (checking || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f1eb] px-6 text-[#64707d]">
        <p className="text-sm font-medium">Verificando tu sesión...</p>
      </main>
    );
  }

  return children;
}
