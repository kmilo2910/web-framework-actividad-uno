import { auth } from '@/config/firebase';

export async function apiFetch(path, options = {}) {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
  return response.status === 204 ? null : response.json();
}
