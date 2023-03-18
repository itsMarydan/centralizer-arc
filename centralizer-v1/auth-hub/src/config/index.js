import * as dotenv from "dotenv";

const bunyan = require('bunyan');
// Load package.json
// import * as pjs from '../../package.json';
require('dotenv').config();
dotenv.config();
// Get some meta info from the package.json
const projectName = "auth";
const projectVersion = "1.0.0";
const env = process.env.ENV;

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({
    name: `${serviceName}:${serviceVersion}`,
    level
});

// Configuration options for different environments

const { MONGO_USER, MONGO_PWD, MONGO_DB, MONGO_HOSTNAME, MONGO_PORT} = process.env;
const uri = `mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const  dbUrl = process.env.DB_URL;
const dbName= process.env.DB_NAME;
const dbUser= process.env.DB_USER;
const dbPwd= process.env.DB_PWD;

const mongoUser = process.env.MONGO_USER;
const mongoPwd = process.env.MONGO_PWD;
const mongoDb = process.env.MONGO_DB;
const mongoHostname = process.env.MONGO_HOSTNAME;
const mongoPort = process.env.MONGO_PORT;


module.exports = {
    environment: {
        projectName,
        projectVersion,
        env,
        db: {
            url: dbUrl,
            database: dbName,
            user: dbUser,
            pwd: dbPwd,
            type: 'mongodb',
            mongo: {
                mongoPort,
                mongoHostname,
                mongoDb,
                mongoUser,
                mongoPwd,
            }
        },
        serviceTimeout: 30,
        log: () => getLogger(projectName,
            projectVersion, 'debug'),
    },
};
