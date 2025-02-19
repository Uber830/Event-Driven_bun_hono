import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// Tabla de usuarios
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Identificador único del usuario
  username: varchar("username", { length: 50 }).unique().notNull(), // Nombre de usuario (único)
  email: varchar("email", { length: 100 }).unique().notNull(), // Correo electrónico (único)
  password_hash: varchar("password_hash", { length: 255 }).notNull(), // Contraseña encriptada
  created_at: timestamp("created_at").defaultNow(), // Fecha de creación
  updated_at: timestamp("updated_at").defaultNow(), // Fecha de última actualización
});

// Tabla de tokens de recuperación de contraseña
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(), // Identificador único del token
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // ID del usuario asociado
  token: varchar("token", { length: 100 }).unique().notNull(), // Token único para recuperación
  expires_at: timestamp("expires_at").notNull(), // Fecha de expiración del token
  used: boolean("used").default(false), // Indica si el token ya fue usado
  created_at: timestamp("created_at").defaultNow(), // Fecha de creación del token
});
