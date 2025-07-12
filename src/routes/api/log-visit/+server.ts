import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { visits } from '$lib/schema';
import { v4 as uuidv4 } from 'uuid';
import isBot from 'is-bot';
import { dev } from '$app/environment';

function isPrivateIP(ip: string): boolean {
	const parts = ip.split('.').map(Number);
	if (parts.length !== 4) {
		return false; // Not a valid IPv4 address for this check
	}
	if (parts[0] === 10) {
		return true;
	}
	if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
		return true;
	}
	if (parts[0] === 192 && parts[1] === 168) {
		return true;
	}
	return false;
}

export async function POST({ request, getClientAddress, cookies }) {
	const ip = getClientAddress();
	const ua = request.headers.get('user-agent') ?? 'unknown';

	let visitorId = cookies.get('visitor_id');
	if (!visitorId) {
		visitorId = uuidv4();
		cookies.set('visitor_id', visitorId, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 year
	}

	let country = 'unknown';
	let city = 'unknown';

	const isLocal = ip === '127.0.0.1' || ip === '::1';
	const fetchIP = dev && isLocal ? '8.8.8.8' : ip;

	if (isPrivateIP(ip)) {
		country = 'Private Network';
		city = 'Private Network';
	} else if (isLocal && !dev) {
		country = 'localhost';
		city = 'localhost';
	} else {
		try {
			const locationRes = await fetch(`https://ipinfo.io/${fetchIP}/json`);
			if (locationRes.ok) {
				const location = await locationRes.json();
				country = location.country ?? 'unknown';
				city = location.city ?? 'unknown';
			} else {
				console.log(`ipinfo.io request for ${fetchIP} failed with status:`, locationRes.status);
			}
		} catch (error) {
			console.error(`Failed to fetch location for ${fetchIP}:`, error);
		}
	}

	await db.insert(visits).values({
		visitorId,
		ip, // Log the real IP
		country,
		city,
		datetime: new Date(),
		userAgent: ua,
		isBot: isBot(ua)
	});

	return json({ status: 'ok' });
}
