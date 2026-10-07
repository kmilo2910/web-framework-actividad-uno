import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { cancelReservation } from '@/server/reservations';

export const dynamic = 'force-dynamic';

export async function PATCH(_request, { params }) {
  const session = await auth0.getSession();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
  try {
    return NextResponse.json(await cancelReservation(email, (await params).id));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
