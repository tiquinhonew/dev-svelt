import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { sql } from 'drizzle-orm';
import { visits } from '$lib/schema';

export async function GET() {
	const total = await db.select({ count: sql<number>`count(*)` }).from(visits);
	const unique = await db.select({ count: sql<number>`count(distinct(visitor_id))` }).from(visits);

	const allVisits = await db.select().from(visits);

	return json({
		total: total[0].count,
		unique: unique[0].count,
		visits: allVisits
	});
}
