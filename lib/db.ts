import { Pool, QueryResultRow } from "pg";

// Global cache for connection pool to prevent connection exhaustion in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Please configure a PostgreSQL connection string in your environment.");
  }

  const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

  if (process.env.NODE_ENV === "production") {
    return new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  if (!global.__pgPool) {
    global.__pgPool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return global.__pgPool;
}

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query<T>(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
