import { firebaseAuthAdapter } from '@/infrastructure/firebase/firebase.client';

export const apiClient = {
  async get(path) {
    const token = await firebaseAuthAdapter.getIdToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  }
};
