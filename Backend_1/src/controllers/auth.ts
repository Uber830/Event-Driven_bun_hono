import { Context } from "hono";
import genToken from "../utils/genToken";
import {
  getUserByEmail,
  createUser,
  createPasswordResetToken,
} from "../service/user";

/**
 * @api {post} /Register User
 * @apiGroup Users
 * @access Public
 */
export const registerUser = async (c: Context) => {
  const { username, email, password } = await c.req.json();

  const userExists = await getUserByEmail(email);
  if (userExists) {
    c.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const password_hash = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 9,
  });
  const user = await createUser(username, email, password_hash);
  if (!user) {
    c.status(400);
    throw new Error("Invalid user data");
  }

  const token = await genToken(String(user[0]?.id));
  return c.json({
    success: true,
    data: {
      id: user[0]?.id,
      username: user[0]?.username,
      email: user[0]?.email,
      created_at: user[0]?.created_at,
      updated_at: user[0]?.updated_at,
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

  // Check for existing user
  if (!email || !password) {
    c.status(400);
    throw new Error("Please provide an email and password");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    c.status(401);
    throw new Error("No user found with this email");
  }

  if (!Bun.password.verifySync(password, user?.password_hash)) {
    c.status(401);
    throw new Error("Invalid credentials");
  } else {
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
  }
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
    c.status(400);
    throw new Error("Please provide an email");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    c.status(401);
    throw new Error("No user found with this email");
  }

  const token = await genToken(String(user?.id));
  // 86400 seconds = 24 hours format date expiration
  await createPasswordResetToken(user?.id, token, new Date(Date.now() + 86400));

  return c.json({
    success: true,
    data: {
      id: user?.id,
      name: user?.username,
      email: user?.email,
    },
    message: "User recovered successfully",
  });
};
