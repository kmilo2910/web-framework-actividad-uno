import { firebaseAuthAdapter } from '@/infrastructure/firebase/firebase.client';

export const apiClient = {
  async get(path) {
    const token = await firebaseAuthAdapter.getIdToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  },
  async post(path, body) {
    const token = await firebaseAuthAdapter.getIdToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  },
  async patch(path, body = {}) {
    const token = await firebaseAuthAdapter.getIdToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  },
};
