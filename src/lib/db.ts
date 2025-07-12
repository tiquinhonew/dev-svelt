import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || '3306'),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	waitForConnections: true,
	connectionLimit: 10
});

export const db = drizzle(pool);
