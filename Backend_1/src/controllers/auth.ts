import { Context } from "hono";
import { getConnInfo } from "hono/bun";

import { genToken, newPasswordHash } from "../utils/genToken";
import {
  getUserByEmail,
  createUser,
  createPasswordResetToken,
  getPasswordResetToken,
  updateUser,
  updatePasswordResetToken,
} from "../service/user";
import { publishEvent } from "../utils/rabbitmq";
import { AppError } from "../utils/classErrorCustom";
import { normalizeIp } from "../utils/transformIp";

/**
 * @api {post} /Register User
 * @apiGroup Users
 * @access Public
 */
export const registerUser = async (c: Context) => {
  const { username, email, password } = await c.req.json();

  const userExists = await getUserByEmail(email);
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  // Hash password
  const password_hash = await newPasswordHash(password);
  const user = await createUser(username, email, password_hash);
  if (!user) {
    throw new AppError("Invalid user data", 400);
  }

  // Publich event of register
  const event = {
    type: "USER_REGISTERED",
    data: {
      username: user?.username,
      email: user?.email,
    },
  };

  publishEvent("user_events", event);

  const token = await genToken(String(user?.id));
  return c.json({
    success: true,
    data: {
      id: user?.id,
      username: user?.username,
      email: user?.email,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
    },
    token,
    message: "User created successfully",
  });
};

/**
 * @api {post} /users/login Login User
 * @apiGroup Users
 * @access Public
 */
export const loginUser = async (c: Context) => {
  const { email, password } = await c.req.json();
  const ipAddress = normalizeIp(getConnInfo(c)?.remote?.address!);
  const userAgent = c.req.header("user-agent");

  // Check for existing user
  if (!email || !password) {
    throw new AppError("Please provide an email and password", 400);
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError("No user found with this email", 401);
  }

  const passwordMatch = await Bun.password.verify(
    password,
    user?.password_hash,
  );
  if (!passwordMatch) {
    const event = {
      type: "USER_LOGIN_FAILED",
      data: {
        userId: user?.id,
        attemptTime: new Date(),
        ipAddress,
        userAgent,
      },
    };
    publishEvent("user_events", event);

    throw new AppError("Invalid credentials", 401);
  }

  // Publich event of login
  const event = {
    type: "USER_LOGIN",
    data: {
      userId: user?.id,
      username: user?.username,
      email: user?.email,
      loginTime: new Date(),
      ipAddress,
      userAgent,
    },
  };
  publishEvent("user_events", event);

  const token = await genToken(String(user?.id));
  return c.json({
    success: true,
    data: {
      id: user?.id,
      name: user?.username,
      email: user?.email,
    },
    token,
    message: "User logged in successfully",
  });
};

/**
 * @api {post} /users/recover Recover User
 * @apiGroup Users
 * @access Public
 */
export const recoverUser = async (c: Context) => {
  const { email } = await c.req.json();

  // Check for existing user
  if (!email) {
    throw new AppError("Please provide an email", 400);
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError("No user found with this email", 401);
  }

  const resetToken = await createPasswordResetToken(user?.id);
  // Publich event of recover
  const event = {
    type: "PASSWORD_RESET_REQUEST",
    data: {
      email: user?.email,
      resetToken: resetToken?.token,
    },
  };
  publishEvent("user_events", event);

  return c.json({
    success: true,
    message: "Password reset link send to your email",
  });
};

/**
 * @api {post} /users/reset-password Reset Password
 * @apiGroup Users
 * @access Public
 */
export const validationResetToken = async (c: Context) => {
  const { password, token } = await c.req.json();

  if (!password || !token) {
    throw new AppError("Please provide an password and token", 400);
  }

  const resetToken = await getPasswordResetToken(token);
  if (!resetToken) {
    throw new AppError("Invalid token", 401);
  }

  // Check if token is expired
  if (resetToken?.expires_at < new Date()) {
    throw new AppError("Token expired", 401);
  }

  // Check if token has already been used
  if (resetToken?.used) {
    throw new AppError("Token already used", 401);
  }

  // Hash password
  const password_hash = await newPasswordHash(password);
  const user = await getUserByEmail(resetToken?.user_id.toString());

  const event = {
    type: "PASSWORD_RESET_COMPLETED",
    data: {
      username: user?.username,
      email: user?.email,
    },
  };
  publishEvent("user_events", event);

  // Update user password and password reset token used
  await updateUser(resetToken?.user_id, password_hash);
  await updatePasswordResetToken(resetToken?.id);
  return c.json({
    success: true,
    message: "Password updated successfully",
  });
};
