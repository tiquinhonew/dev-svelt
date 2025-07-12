import { json } from '@sveltejs/kit';

/**
 * ARQUIVO DE DEPURAÇÃO TEMPORÁRIO
 * Este arquivo foi modificado para retornar todos os cabeçalhos da requisição
 * para identificar o cabeçalho de IP correto no ambiente de produção.
 * Ele não salva nenhum dado de visita no momento.
 */
export async function POST({ request }) {
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key] = value;
  }
  return json(headers);
}