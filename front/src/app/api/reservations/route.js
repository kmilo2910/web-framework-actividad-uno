import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createReservation, listReservations } from '@/server/reservations';

export const dynamic = 'force-dynamic';

async function emailFromSession() {
  const session = await auth0.getSession();
  return session?.user;
}

export async function GET() {
  const user = await emailFromSession();
  if (!user?.email) return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
  return NextResponse.json(await listReservations(user.email));
}

export async function POST(request) {
  const user = await emailFromSession();
  if (!user?.email) return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
  try {
    return NextResponse.json(await createReservation(user, await request.json()), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
