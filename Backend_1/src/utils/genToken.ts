import { Jwt } from "hono/utils/jwt";

/**
 * Generate a JWT token
 * @param id - The ID of the user
 * @returns The JWT token
 */

const genToken = (id: string) => {
  return Jwt.sign(
    {
      id,
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    process.env.JWT_SECRET || "",
  );
};

/**
 * Hash a password
 * @param password - The password to be hashed
 * @returns The hashed password
 */

const newPasswordHash = async (password: string) => {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 9,
  });
};

export { genToken, newPasswordHash };
