import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { sql } from 'drizzle-orm';
import { visits } from '$lib/schema';

export async function GET({ url }) {
	const page = Number(url.searchParams.get('page') ?? 1);
	const perPage = Number(url.searchParams.get('perPage') ?? 10);
	const sortColumn = url.searchParams.get('sortColumn') ?? 'datetime';
	const sortDirection = url.searchParams.get('sortDirection') ?? 'desc';
	const selectedMonth = Number(url.searchParams.get('selectedMonth'));
	const selectedYear = Number(url.searchParams.get('selectedYear'));
	const showBots = url.searchParams.get('showBots') === 'true';

	const offset = (page - 1) * perPage;

	let whereClause = sql`1 = 1`; // Start with a true condition

	if (!isNaN(selectedMonth) && !isNaN(selectedYear)) {
		// For Drizzle, filtering by month and year directly on a datetime column
		// might require specific functions depending on the database.
		// For MySQL, you might use MONTH() and YEAR() functions.
		// Assuming datetime is stored in a format that allows direct comparison or extraction.
		// This is a simplified example and might need adjustment based on actual DB functions.
		whereClause = sql`${whereClause} AND MONTH(datetime) = ${selectedMonth} AND YEAR(datetime) = ${selectedYear}`;
	}

	if (!showBots) {
		whereClause = sql`${whereClause} AND is_bot = FALSE`;
	}

	let orderByClause;
	switch (sortColumn) {
		case 'country':
			orderByClause = sql`country ${sortDirection === 'asc' ? sql`ASC` : sql`DESC`}`;
			break;
		case 'city':
			orderByClause = sql`city ${sortDirection === 'asc' ? sql`ASC` : sql`DESC`}`;
			break;
		case 'browser':
		case 'os':
			// Sorting by browser/os name is complex as it's part of userAgent string.
			// For simplicity, we'll sort by userAgent.
			orderByClause = sql`user_agent ${sortDirection === 'asc' ? sql`ASC` : sql`DESC`}`;
			break;
		case 'datetime':
		default:
			orderByClause = sql`datetime ${sortDirection === 'asc' ? sql`ASC` : sql`DESC`}`;
			break;
	}

	const total = await db.select({ count: sql<number>`count(*)` }).from(visits).where(whereClause);
	const unique = await db.select({ count: sql<number>`count(distinct(visitor_id))` }).from(visits).where(whereClause);

	const paginatedVisits = await db
		.select()
		.from(visits)
		.where(whereClause)
		.orderBy(orderByClause)
		.limit(perPage)
		.offset(offset);

	const totalItems = total[0].count;
	const totalPages = Math.ceil(totalItems / perPage);

	return json({
		unique: unique[0].count,
		pagination: {
			page,
			perPage,
			totalPages,
			totalItems
		},
		visits: paginatedVisits
	});
}
