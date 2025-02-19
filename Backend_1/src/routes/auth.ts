import { Hono } from "hono";
import { registerUser, loginUser, recoverUser } from "../controllers/auth";

const authRoutes = new Hono()
  .post("/login", (c) => loginUser(c))
  .post("/register", (c) => registerUser(c))
  .post("/recover", (c) => recoverUser(c));

export default authRoutes;
