import { NextResponse } from 'next/server';
import { getPostgresPool } from '@/server/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();
  try {
    await getPostgresPool().query('SELECT 1');
    return NextResponse.json({
      ok: true,
      service: 'nexus-campus-digital',
      database: 'connected',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      responseTimeMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        service: 'nexus-campus-digital',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
