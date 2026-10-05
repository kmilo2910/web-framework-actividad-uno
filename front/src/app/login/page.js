'use client';

import { useState } from 'react';
import { AuthUseCase } from '@/application/auth.use-case';
import { firebaseAuthAdapter } from '@/infrastructure/firebase/firebase.client';
import { apiClient } from '@/infrastructure/http/api.client';

const authUseCase = new AuthUseCase(firebaseAuthAdapter);

export default function LoginPage() {
  const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [user, setUser] = useState(null);
  async function login() {
    setLoading(true); setError('');
    try {
      await authUseCase.loginWithGoogle();
      const token = await authUseCase.getIdToken();
      const profile = await apiClient.get('/api/auth/me');
      setUser(profile);
    }
    catch (err) { setError(err.message || 'No fue posible iniciar sesión'); }
    finally { setLoading(false); }
  }
  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">NEXUS</p><h1>Bienvenido</h1><p>Inicia sesión para acceder a la biblioteca y al coworking.</p><button className="button button-google" onClick={login} disabled={loading}>{loading ? 'Conectando...' : 'Continuar con Google'}</button>{error && <p className="error">{error}</p>}{user && <div className="success"><strong>Sesión iniciada</strong><span>{user.email}</span></div>}</section></main>;
}
