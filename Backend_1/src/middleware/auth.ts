import { Context, Next } from "hono";
import { Jwt } from "hono/utils/jwt";
import { getUserById } from "../service/user";
import { AppError } from "../utils/classErrorCustom";

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
        throw new AppError("Invalid token! You are not authorized!", 401);
      }
      c.set("user", user);

      await next();
    } catch (err) {
      throw new AppError("Invalid token! You are not authorized!", 401);
    }
  }

  if (!token) {
    throw new AppError("Not authorized to access this route", 401);
  }
};
