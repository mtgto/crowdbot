import * as winston from "winston";

/**
 * Logger
 */
export const log = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.colorize(),
    ),
    transports: [new winston.transports.Console()],
});
