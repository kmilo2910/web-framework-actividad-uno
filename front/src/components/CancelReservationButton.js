'use client';
import { useState } from 'react';
import { apiClient } from '@/infrastructure/http/api.client';
export default function CancelReservationButton({ reservationId, onCancelled }) {
  const [loading, setLoading] = useState(false);
  async function cancel() {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    setLoading(true);
    try {
      await apiClient.patch(`/api/reservations/${reservationId}/cancel`);
      onCancelled(reservationId);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      onClick={cancel}
      disabled={loading}
      className="text-sm font-semibold text-red-700 hover:underline"
    >
      {loading ? 'Cancelando...' : 'Cancelar reserva'}
    </button>
  );
}
