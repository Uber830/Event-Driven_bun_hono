import { failedLoginAttempts, successfulLogins } from "../models/user";
import db from "../config/db";
import { sql } from "drizzle-orm";
import { userLoginEvent, UserEvent } from "../types/user";

/**
 * Register user login information
 * @param userId - The ID of the user
 * @param email - The email of the user
 * @param ipAddress - The IP address of the user
 * @param userAgent - The user agent of the user
 */

async function insertSuccessfulLogin(userLoginEvent: userLoginEvent) {
  const login = await db
    .insert(successfulLogins)
    .values({
      userId: userLoginEvent.userId,
      name: userLoginEvent.username,
      email: userLoginEvent.email,
      loginTime: new Date(userLoginEvent.loginTime),
      ipAddress: userLoginEvent.ipAddress,
      userAgent: userLoginEvent.userAgent,
    })
    .returning();
  return login[0];
}

/**
 * Register user login failed attempts
 * @param userId - The ID of the user
 * @param ipAddress - The IP address of the user
 * @param userAgent - The user agent of the user
 * @param reason - The reason for the failed login attempt
 */

async function insertFailedLogin(userLoginEvent: UserEvent) {
  console.log("\nuserLoginEvent", userLoginEvent);
  const login = await db
    .insert(failedLoginAttempts)
    .values({
      userId: userLoginEvent.data.userId,
      attemptTime: new Date(userLoginEvent.data.attemptTime),
      ipAddress: userLoginEvent.data.ipAddress,
      userAgent: userLoginEvent.data.userAgent,
      reason: userLoginEvent.type,
    })
    .returning();
  return login[0];
}

async function loginForHours(hours: number) {
  const login = await db
    .select()
    .from(successfulLogins)
    .where(
      sql`${successfulLogins.loginTime} >= NOW() - INTERVAL '${hours} hours'`,
    )
    .orderBy(sql`${successfulLogins.loginTime} DESC`);

  return login[0];
}

///**
// * Update a user
// * @param id - The ID of the user
// * @param passwordHash - The new hashed password of the user
// */
//async function updateUser(id: number, passwordHash: string) {
//  const user = await db
//    .update(users)
//    .set({
//      password_hash: passwordHash,
//    })
//    .where(eq(users.id, id))
//    .returning();
//  return user[0];
//}

///**
// * Update a password reset token
// * @param id - The ID of the password reset token
// */
//async function updatePasswordResetToken(id: number) {
//  const resetToken = await db
//    .update(passwordResetTokens)
//    .set({
//      used: true,
//    })
//    .where(eq(passwordResetTokens.id, id))
//    .returning();
//  return resetToken[0];
//}

export { insertSuccessfulLogin, insertFailedLogin, loginForHours };
