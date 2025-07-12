import { json } from '@sveltejs/kit';

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ request }) {
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key] = value;
  }
  return json(headers);
}
