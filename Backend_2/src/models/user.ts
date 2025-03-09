import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// Table of users logged in successfully
export const successfulLogins = pgTable("successful_logins", {
  id: serial("id").primaryKey(),
  userId: varchar("userid", { length: 36 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  loginTime: timestamp("logintime").defaultNow().notNull(),
  ipAddress: varchar("ipaddress", { length: 45 }),
  userAgent: varchar("useragent", { length: 512 }),
});

// Tabla de intentos fallidos
export const failedLoginAttempts = pgTable("failed_login_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("userid", { length: 36 }),
  attemptTime: timestamp("attempttime").defaultNow().notNull(),
  ipAddress: varchar("ipaddress", { length: 45 }),
  userAgent: varchar("useragent", { length: 512 }),
  reason: varchar("reason", { length: 255 }),
});
