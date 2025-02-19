import { users, passwordResetTokens } from "../models/user";
import db from "../config/db";
import { eq } from "drizzle-orm";

/**
 * Create a new user
 * @param username - The username of the user
 * @param email - The email of the user
 * @param passwordHash - The hashed password of the user
 */
async function createUser(
  username: string,
  email: string,
  passwordHash: string,
) {
  return await db
    .insert(users)
    .values({
      username,
      email,
      password_hash: passwordHash,
    })
    .returning();

  // console.log("Usuario creado:", newUser);
}

/**
 * Create a new password reset token
 * @param userId - The ID of the user
 * @param token - The token to be used
 * @param expiresAt - The expiration date of the token
 */
async function createPasswordResetToken(
  userId: number,
  token: string,
  expiresAt: Date,
) {
  return await db
    .insert(passwordResetTokens)
    .values({
      user_id: userId,
      token,
      expires_at: expiresAt,
      used: true,
    })
    .returning();
}

/**
 * Verify a password reset token
 * @param token - The token to be verified
 * @param expiresAt - The expiration date of the token
 */
async function getUserByEmail(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user[0];
}

/**
 * Get a user by ID
 * @param id - The ID of the user
 */
async function getUserById(id: number) {
  const user = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      created_at: users.created_at,
      updated_at: users.updated_at,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user[0];
}

export { createUser, createPasswordResetToken, getUserByEmail, getUserById };
