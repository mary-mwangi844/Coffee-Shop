import { proxyToBackend } from '@/lib/proxy';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { status, data } = await proxyToBackend(
      '/auth/forgot-password',
      'POST',
      {
        identifier: body.identifier,
      },
    );

    return Response.json(data, { status });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to start password reset',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}