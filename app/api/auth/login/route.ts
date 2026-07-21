import { proxyToBackend } from '@/lib/proxy';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { status, data } = await proxyToBackend(
      '/auth/login',
      'POST',
      {
        identifier: body.identifier,
        password: body.password,
      },
    );

    return Response.json(data, { status });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to login',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}