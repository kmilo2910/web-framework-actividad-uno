'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Check, Coffee, ShieldCheck } from 'lucide-react';
import { AuthUseCase } from '@/application/auth.use-case';
import { firebaseAuthAdapter } from '@/infrastructure/firebase/firebase.client';
import { apiClient } from '@/infrastructure/http/api.client';

const authUseCase = new AuthUseCase(firebaseAuthAdapter);

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  async function login() {
    setLoading(true);
    setError('');
    try {
      await authUseCase.loginWithGoogle();
      const profile = await apiClient.get('/api/auth/me');
      setUser(profile);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'No fue posible iniciar sesión');
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#f4f1eb] p-4 text-[#17202a] md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-[#17202a]/10 lg:grid-cols-[1.15fr_.85fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#1f4f66] p-8 text-[#f4f1eb] md:p-12 lg:p-16">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[50px] border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full border-[70px] border-white/10" />
          <div className="relative">
            <div className="flex items-center gap-3 font-semibold tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f1eb] text-[#1f4f66]">
                <BookOpen size={20} />
              </span>
              <span className="text-xl">Nexus</span>
            </div>
            <div className="mt-24 max-w-xl md:mt-32">
              <p className="text-xs font-bold uppercase tracking-[.24em] text-[#b8d2d6]">
                Tu campus digital
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-[.98] tracking-[-.06em] md:text-7xl">
                Un lugar para avanzar.
              </h1>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-[#dbe8ea]">
                Conecta con los recursos y espacios que hacen que tus ideas cobren vida.
              </p>
            </div>
          </div>
          <div className="relative mt-16 grid gap-4 text-sm text-[#dbe8ea] sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Check size={16} /> Catálogo universitario
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} /> Espacios de coworking
            </span>
          </div>
        </section>
        <section className="flex items-center justify-center p-8 md:p-14">
          <div className="w-full max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">
              Acceso seguro
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em]">Bienvenido a Nexus</h2>
            <p className="mt-4 leading-relaxed text-[#64707d]">
              Inicia sesión para consultar tus recursos, compras y reservas.
            </p>
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-[#d8d5ce] p-4">
                <ShieldCheck className="shrink-0 text-[#1f4f66]" size={21} />
                <div>
                  <p className="text-sm font-semibold">Una cuenta, todo tu campus</p>
                  <p className="mt-1 text-xs text-[#64707d]">Autenticación protegida por Google</p>
                </div>
              </div>
              <button
                className="flex w-full items-center justify-between rounded-2xl bg-[#1f4f66] px-5 py-4 font-semibold text-white transition hover:bg-[#173b4d] disabled:cursor-wait disabled:opacity-60"
                onClick={login}
                disabled={loading}
              >
                <span>{loading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <ArrowRight size={19} />
                )}
              </button>
            </div>
            {error && <p className="error mt-5">{error}</p>}
            {user && (
              <div className="success mt-5">
                <strong>Sesión iniciada</strong>
                <span>{user.email}</span>
              </div>
            )}
            <div className="mt-10 flex items-center gap-2 text-xs text-[#64707d]">
              <Coffee size={15} /> Acceso para estudiantes y comunidad universitaria
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
