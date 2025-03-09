import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";

import dbInit from "./config/db";
import initializeDatabase from "./config/initDb";
// import appRoutes from "./routes/index";
import { notFound, errorHandler } from "./middleware/error";
import { connectRabbitMQ } from "./utils/rabbitmqConsumer";
import { startUserEventConsumer } from "./service/userEventConsumer";

// Connect to RabbitMQ
const startApplication = async () => {
  await connectRabbitMQ();
  startUserEventConsumer();
};

startApplication().catch((error) => {
  console.error("Failed to start application:", error);
});
// Config db
dbInit;
initializeDatabase()
  .then(() => {
    console.log("Base de datos creada correctamente.");
  })
  .catch((error) => {
    console.error("Error al crear la base de datos:", error);
  });

// Home page
const home = new Hono();

// Middleware
home.use("*", logger(), prettyJSON());
home.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["GET", "POST", "PUT", "DELETE"],
    exposeHeaders: ["Content-Type", "Authorization"],
  }),
);

// Home page
home.get("/", (c) => {
  return c.json({ message: "Welcome to the API" });
});

// Users
//home.route("/api", appRoutes);

// Error Handler
home.onError((_, c) => {
  return errorHandler(c);
});

// Not Found Handler
home.notFound((c) => {
  return notFound(c);
});

export default home;
