import { Hono } from "hono";
import authRoutes from "./auth";
import userRoutes from "./user";

const appRoutes = new Hono();

// Routes
appRoutes.route("/auth", authRoutes);
appRoutes.route("/users", userRoutes);

export default appRoutes;
