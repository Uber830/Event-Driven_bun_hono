import { sql } from "drizzle-orm";
import db from "./db";

async function initializeDatabase() {
  try {
    // Create the `users` table
    await db.execute(sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

    // Create the `password_reset_tokens` table
    await db.execute(sql`
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token VARCHAR(100) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    console.log("Tablas creadas correctamente.");
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  }
}

export default initializeDatabase;
