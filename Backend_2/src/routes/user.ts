import { Hono } from "hono";
// import { protect } from "../middleware/auth";
// import { registerUser, loginUser } from "../controllers/auth";

const userRoutes = new Hono();
// .use("/*", protect) // Middleware de autenticación para todas las rutas
// .get("/profile", (c) => {
//   return c.json({ message: "User Profile" });
// })
// .put("/profile", (c) => {
//   return c.json({ message: "Update User Profile" });
// })
// .get("/", (c) => c.json({ message: "All users" }))
// .get("/:id", (c) => c.json({ message: `User ${c.req.param("id")}` }))
// .delete("/:id", (c) => {
//   return c.json({ message: `Delete User ${c.req.param("id")}` });
// });

export default userRoutes;
