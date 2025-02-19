import { Context, Next } from "hono";
import { Jwt } from "hono/utils/jwt";
import { getUserById } from "../service/user";

// Protect Route for Authenticated Users
export const protect = async (c: Context, next: Next) => {
  let token;

  if (
    c.req.header("Authorization") &&
    c.req.header("Authorization")?.startsWith("Bearer")
  ) {
    try {
      token = c.req.header("Authorization")?.replace(/Bearer\s+/i, "");
      if (!token) {
        return c.json({ message: "Not authorized to access this route" });
      }

      const { id } = await Jwt.verify(token, process.env.JWT_SECRET || "");
      const user = await getUserById(Number(id));
      if (!user) {
        throw new Error("Error: Get user by id");
      }
      c.set("user", user);

      await next();
    } catch (err) {
      throw new Error("Invalid token! You are not authorized!");
    }
  }

  if (!token) {
    throw new Error("Not authorized! No token found!");
  }
};
