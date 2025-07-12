import { json } from '@sveltejs/kit';

export async function GET({ request }) {
  try {
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }
    return json(headers);
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    return json({ error: 'Failed to read headers', details: error }, { status: 500 });
  }
}