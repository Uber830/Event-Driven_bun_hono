import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Creation of url connection
const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log(DATABASE_URL, "DATABASE_URL 1");
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle({ client: pool });

if (!db) {
  throw new Error("Unable to connect to the database");
}
console.log("Database connected 🚀");

export default db;
