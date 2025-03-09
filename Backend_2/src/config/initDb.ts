import { sql } from "drizzle-orm";
import db from "./db";

async function initializeDatabase() {
  try {
    await db.execute(sql`
            CREATE TABLE IF NOT EXISTS successful_logins (
                id SERIAL PRIMARY KEY,
                userId VARCHAR(36) NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                loginTime TIMESTAMP DEFAULT NOW() NOT NULL,
                ipAddress VARCHAR(45),
                userAgent VARCHAR(512)
            );
        `);

    await db.execute(sql`
            CREATE TABLE IF NOT EXISTS failed_login_attempts (
                id SERIAL PRIMARY KEY,
                userId VARCHAR(36),
                attemptTime TIMESTAMP DEFAULT NOW() NOT NULL,
                ipAddress VARCHAR(45),
                userAgent VARCHAR(512),
                reason VARCHAR(255)
            );
        `);

    console.log("Tablas creadas correctamente.");
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  }
}

export default initializeDatabase;
