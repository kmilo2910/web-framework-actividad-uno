import { auth0 } from '@/lib/auth0';
import { createReservation, listReservations } from '@/server/reservations';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

async function emailFromSession() {
  const session = await auth0.getSession();
  return session?.user;
}

export async function GET() {
  const user = await emailFromSession();
  if (!user?.email) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  return apiSuccess(await listReservations(user.email), 'Reservas cargadas correctamente');
}

export async function POST(request) {
  const user = await emailFromSession();
  if (!user?.email) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  try {
    return apiSuccess(
      await createReservation(user, await request.json()),
      'Reserva creada correctamente',
      201,
      'CREATED'
    );
  } catch (error) {
    return apiError(error.message, 400, 'RESERVATION_ERROR');
  }
}
