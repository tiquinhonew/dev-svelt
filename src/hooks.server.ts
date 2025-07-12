import 'dotenv/config';

/** @type {import('@sveltejs/kit').Handle} */
export function handle({ event, resolve }) {
	const { request, getClientAddress } = event;
	const clientAddress = getClientAddress();

	// Adicione o IP do cliente ao objeto `platform` do evento
	event.platform = { ...event.platform, clientAddress };

	return resolve(event);
}
