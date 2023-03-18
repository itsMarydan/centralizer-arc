import winston from "winston";
import ecsFormat from "@elastic/ecs-winston-format";

export const logger = winston.createLogger({
    level: 'debug',
    format: ecsFormat({ convertReqRes: true }),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            //path to log file
            filename: 'log/json.log',
            level: 'debug'
        })
    ]
})