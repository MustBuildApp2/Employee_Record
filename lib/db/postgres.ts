import "server-only";
import { Pool, PoolClient, QueryResultRow } from "pg";

let pool: Pool | undefined;

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: required("DATABASE_HOST"),
      port: Number(process.env.DATABASE_PORT || 5432),
      database: required("DATABASE_NAME"),
      user: required("DATABASE_USER"),
      password: process.env.DATABASE_PASSWORD || undefined,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
      max: Number(process.env.DATABASE_POOL_MAX || 10),
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values);
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
