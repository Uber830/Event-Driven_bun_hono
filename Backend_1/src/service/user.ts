import { users, passwordResetTokens } from "../models/user";
import db from "../config/db";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

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
  const user = await db
    .insert(users)
    .values({
      username,
      email,
      password_hash: passwordHash,
    })
    .returning();
  return user[0];
}

/**
 * Create a new password reset token
 * @param userId - The ID of the user
 * @param token - The token to be used
 * @param expiresAt - The expiration date of the token
 */
async function createPasswordResetToken(userId: number) {
  // Set expiration date - 24 hours
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000);
  const token = nanoid(100);

  const resetToken = await db
    .insert(passwordResetTokens)
    .values({
      user_id: userId,
      token,
      expires_at: expiresAt,
      used: false,
    })
    .returning();
  return resetToken[0];
}

/**
 * Get a user by email
 * @param email - The email of the user
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

/**
 * Get a password reset token by token
 * @param token - The token of the password reset
 */
async function getPasswordResetToken(token: string) {
  const resetToken = await db
    .select({
      id: passwordResetTokens.id,
      token: passwordResetTokens.token,
      user_id: passwordResetTokens.user_id,
      expires_at: passwordResetTokens.expires_at,
      used: passwordResetTokens.used,
    })
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        // eq(passwordResetTokens.used, false),
      ),
    )
    .limit(1);
  return resetToken[0];
}

/**
 * Update a user
 * @param id - The ID of the user
 * @param passwordHash - The new hashed password of the user
 */
async function updateUser(id: number, passwordHash: string) {
  const user = await db
    .update(users)
    .set({
      password_hash: passwordHash,
    })
    .where(eq(users.id, id))
    .returning();
  return user[0];
}

/**
 * Update a password reset token
 * @param id - The ID of the password reset token
 */
async function updatePasswordResetToken(id: number) {
  const resetToken = await db
    .update(passwordResetTokens)
    .set({
      used: true,
    })
    .where(eq(passwordResetTokens.id, id))
    .returning();
  return resetToken[0];
}

export {
  createUser,
  createPasswordResetToken,
  getUserByEmail,
  getUserById,
  getPasswordResetToken,
  updateUser,
  updatePasswordResetToken,
};
