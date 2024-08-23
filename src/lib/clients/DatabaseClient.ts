import { DB_TABLE_PREFIX } from '$env/static/private';
import { type Database } from '$lib/tables/Database';
import { createKysely } from '@vercel/postgres-kysely';
import { CamelCasePlugin } from 'kysely';
import { TablePrefixPlugin } from 'kysely-plugin-prefix';

/**
 * Abstract class for clients used to query the database.
 */
export abstract class DatabaseClient {
	private userId: string;
	private database;

	/**
	 * Constructor.
	 *
	 * @param userId id of the current user
	 */
	constructor(userId: string) {
		this.database = createKysely<Database>()
			.withPlugin(new CamelCasePlugin())
			.withPlugin(new TablePrefixPlugin({ prefix: DB_TABLE_PREFIX }));

		this.userId = userId;
	}

	/**
	 * Get the database.
	 *
	 * @returns database
	 */
	protected getDatabase() {
		return this.database;
	}

	/**
	 * Get the id of the current user.
	 *
	 * @returns id of the current user
	 */
	protected getUserId() {
		return this.userId;
	}
}
