'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/infrastructure/http/api.client';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebase.client';
import Toast from '@/components/Toast';
import { useRouter } from 'next/navigation';
export default function ReserveButton({
  spaceId,
  disabled = false,
  availableAt,
  occupiedFrom,
  occupiedByEmail,
  reservationId,
}) {
  const [currentEmail, setCurrentEmail] = useState(null);
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [duration, setDuration] = useState('60');
  const [reservation, setReservation] = useState(null);
  const [toast, setToast] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const router = useRouter();
  const maxStartMinutes = 20 * 60 - Number(duration);
  const maxStart = `${String(Math.floor(maxStartMinutes / 60)).padStart(2, '0')}:${String(maxStartMinutes % 60).padStart(2, '0')}`;
  const weekdays = Array.from({ length: 21 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  }).filter((date) => ![0, 6].includes(date.getDay()));
  const timeOptions = Array.from(
    { length: Math.floor((maxStartMinutes - 8 * 60) / 15) + 1 },
    (_, index) => {
      const total = 8 * 60 + index * 15;
      return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    }
  );
  const [scheduleMessage, setScheduleMessage] = useState('');
  useEffect(() => onAuthStateChanged(auth, (user) => setCurrentEmail(user?.email || null)), []);
  const isOwner = currentEmail && occupiedByEmail && currentEmail === occupiedByEmail;
  const minutesUntilStart = occupiedFrom
    ? (new Date(occupiedFrom).getTime() - Date.now()) / 60000
    : Infinity;
  const cancellationBlocked = minutesUntilStart <= 30;
  async function reserve() {
    if (!date) {
      setMessage('Selecciona una fecha');
      return;
    }
    const selectedDate = new Date(`${date}T12:00:00`);
    if ([0, 6].includes(selectedDate.getDay())) {
      setScheduleMessage('El coworking solo funciona de lunes a viernes');
      return;
    }
    setScheduleMessage('');
    setState('loading');
    setMessage('');
    try {
      const created = await apiClient.post('/api/reservations', {
        spaceId,
        durationMinutes: duration,
        reservationDate: date,
        reservationTime: time,
      });
      setReservation(created);
      setState('idle');
      setToast('Reserva confirmada correctamente');
    } catch (error) {
      setState('error');
      setMessage(error.message);
    }
  }
  async function cancel() {
    setState('loading');
    try {
      await apiClient.patch(`/api/reservations/${reservation?.id || reservationId}/cancel`);
      setReservation(null);
      setCancelled(true);
      setState('idle');
      setToast('Reserva cancelada');
      router.refresh();
    } catch (error) {
      setState('error');
      setMessage(error.message);
    }
  }
  const ownStart = reservation?.startsAt || occupiedFrom;
  const ownMinutesUntilStart = ownStart
    ? (new Date(ownStart).getTime() - Date.now()) / 60000
    : Infinity;
  const ownCancellationBlocked = ownMinutesUntilStart <= 30;
  if (reservation)
    return (
      <>
        <div className="text-sm text-[#1f4f66]">
          <p className="font-semibold">Reservado por ti</p>
          <p className="mt-1 text-xs text-[#64707d]">
            {new Date(reservation.startsAt).toLocaleString('es-CO')}
          </p>
          {ownCancellationBlocked ? (
            <span className="mt-2 block text-xs text-[#64707d]">
              La cancelación ya no está disponible
            </span>
          ) : (
            <button
              onClick={cancel}
              className="mt-2 text-sm font-semibold text-red-700 hover:underline"
            >
              Cancelar reserva
            </button>
          )}
        </div>
        <Toast message={toast} onClose={() => setToast('')} />
      </>
    );
  if (disabled && !cancelled) {
    if (isOwner)
      return (
        <>
          <div className="text-sm text-[#a4511f]">
            <div className="flex items-center gap-2">
              Tu reserva{' '}
              {cancellationBlocked && (
                <span
                  aria-label="Información sobre la cancelación"
                  className="group relative grid h-5 w-5 cursor-help place-items-center rounded-full border border-[#a4511f] text-xs font-bold"
                >
                  i
                  <span className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden w-64 -translate-x-1/2 rounded-lg bg-[#17202a] p-3 text-left text-xs font-normal leading-relaxed text-white shadow-lg group-hover:block">
                    No puedes cancelar dentro de los 30 minutos previos al inicio ni después de que
                    la reserva haya comenzado.
                  </span>
                </span>
              )}
            </div>
            {cancellationBlocked ? (
              <span className="block text-xs text-[#64707d]">
                La cancelación ya no está disponible
              </span>
            ) : (
              <button
                onClick={cancel}
                disabled={state === 'loading'}
                className="mt-2 text-sm font-semibold text-red-700 hover:underline"
              >
                {state === 'loading' ? 'Cancelando...' : 'Cancelar reserva'}
              </button>
            )}
          </div>
          <Toast message={toast} onClose={() => setToast('')} />
        </>
      );
    return (
      <div className="text-sm text-[#a4511f]">
        No disponible
        {availableAt && (
          <span className="block text-xs text-[#64707d]">
            Se libera a las{' '}
            {new Date(availableAt).toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    );
  }
  return (
    <>
      <div className="w-full max-w-xs">
        <div className="mb-3 grid grid-cols-3 gap-2">
          <label className="text-xs text-[#64707d]">
            Fecha
            <select
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setScheduleMessage('');
              }}
              className="mt-1 w-full rounded-lg border border-[#d8d5ce] p-2 text-sm"
            >
              <option value="">Seleccionar</option>
              {weekdays.map((option) => (
                <option
                  key={option.toISOString().slice(0, 10)}
                  value={option.toISOString().slice(0, 10)}
                >
                  {option.toLocaleDateString('es-CO', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-[#64707d]">
            Hora
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8d5ce] p-2 text-sm"
            >
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-[#64707d]">
            Duración
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8d5ce] p-2 text-sm"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </label>
        </div>
        {scheduleMessage && <p className="mb-2 text-xs text-red-700">{scheduleMessage}</p>}
        <button
          onClick={reserve}
          disabled={state === 'loading' || state === 'done'}
          className="rounded-full bg-[#1f4f66] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {state === 'loading'
            ? 'Reservando...'
            : state === 'done'
              ? 'Reservado'
              : 'Reservar espacio'}
        </button>
        {message && (
          <p className={`mt-2 text-xs ${state === 'error' ? 'text-red-700' : 'text-green-700'}`}>
            {message}
          </p>
        )}
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
