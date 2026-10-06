'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { apiClient } from '@/infrastructure/http/api.client';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';
export default function PurchaseButton({ bookId }) {
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      apiClient
        .get('/api/purchases/mine')
        .then((items) => {
          if (items.some((item) => item.bookId === bookId)) {
            setState('done');
            setMessage('Ya adquiriste esta publicación');
          }
        })
        .catch(() => {});
    });
    return unsubscribe;
  }, [bookId]);
  async function buy() {
    setState('loading');
    setMessage('');
    try {
      await apiClient.post('/api/purchases', { bookId });
      setState('done');
      setMessage('Adquisición registrada');
    } catch (error) {
      setState('error');
      setMessage(error.message);
    }
  }
  return (
    <div>
      <button
        onClick={buy}
        disabled={state === 'loading' || state === 'done'}
        className="mt-8 flex items-center gap-2 rounded-full bg-[#1f4f66] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        <ShoppingBag size={18} />
        {state === 'loading' ? 'Procesando...' : state === 'done' ? 'Adquirido' : 'Comprar'}
      </button>
      {message && (
        <p className={`mt-3 text-sm ${state === 'error' ? 'text-red-700' : 'text-green-700'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
