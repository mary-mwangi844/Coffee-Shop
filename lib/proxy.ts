const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function proxyToBackend(
  path: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
) {
  const url = `${API_BASE}${path}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);
  
  return { status: response.status, data };
}
