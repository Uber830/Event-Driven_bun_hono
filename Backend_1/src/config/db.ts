import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle({ client: pool });

if (!db) {
  throw new Error("Unable to connect to the database");
}
console.log("Database connected 🚀");

export default db;
