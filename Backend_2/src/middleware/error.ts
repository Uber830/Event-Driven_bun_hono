import { Context } from "hono";
import { logError } from "../utils/loggerError";

export const errorHandler = (c: Context) => {
  const error = c.error;
  const isProduction = process.env.NODE_ENV === "production";

  if (error) {
    logError(error); // Register the error in the logger file
  }

  // Menssage of error - Production mode
  return c.json(
    {
      success: false,
      message: isProduction ? "Something went wrong" : error?.message,
      ...(!isProduction && { stack: error?.stack }),
    },
    isProduction ? 500 : 400,
  );
};

// Not Found Handler
export const notFound = (c: Context) => {
  const error = c.error;
  if (error) {
    logError(error);
  }

  return c.json({
    success: false,
    message: `Not Found - [${c.req.method}] ${c.req.url}`,
  });
};
