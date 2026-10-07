import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createPurchase, listPurchases } from '@/server/purchases';
export const dynamic = 'force-dynamic';
export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
  return NextResponse.json(await listPurchases(session.user.email));
}
export async function POST(request) {
  const session = await auth0.getSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
  try {
    return NextResponse.json(await createPurchase(session.user, (await request.json()).bookId), {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
