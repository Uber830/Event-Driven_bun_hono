import { createLogger, format, transports } from "winston";

/**
 * Logger for handling errors
 */
const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.Console({ format: format.simple() }),
  ],
});

/**
 * Log an error
 * @param error - The error to be logged
 */
export const logError = (error: Error | undefined | null) => {
  if (!error) {
    logger.error("An undefined error has occurred");
    return;
  }

  logger.error(error.message, { stack: error.stack });
};
