import { mysqlTable, serial, varchar, datetime, boolean } from 'drizzle-orm/mysql-core';

export const visits = mysqlTable('visits', {
	id: serial('id').primaryKey(),
	visitorId: varchar('visitor_id', { length: 255 }),
	ip: varchar('ip', { length: 45 }),
	country: varchar('country', { length: 100 }),
	city: varchar('city', { length: 100 }),
	datetime: datetime('datetime'),
	userAgent: varchar('user_agent', { length: 255 }),
	isBot: boolean('is_bot').default(false)
});
