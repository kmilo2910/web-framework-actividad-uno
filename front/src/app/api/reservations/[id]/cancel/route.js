import { auth0 } from '@/lib/auth0';
import { cancelReservation } from '@/server/reservations';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function PATCH(_request, { params }) {
  const session = await auth0.getSession();
  const email = session?.user?.email;
  if (!email) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  try {
    return apiSuccess(
      await cancelReservation(email, (await params).id),
      'Reserva cancelada correctamente'
    );
  } catch (error) {
    return apiError(error.message, 400, 'CANCELLATION_ERROR');
  }
}
