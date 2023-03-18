import * as dotenv from "dotenv";

// Load package.json
import * as pjs from '../../package.json';
require('dotenv').config();
dotenv.config();
// Get some meta info from the package.json
const projectName = pjs.name;
const projectVersion = pjs.version;
const env = process.env.ENV;

// Set up a logger


// Configuration options for different environments
const  dbUrl = process.env.DB_URL;
const dbName= process.env.DB_NAME;


module.exports = {
    environment: {
        projectName,
        projectVersion,
        env,
        db: {
            url: dbUrl,
            database: dbName,
            type: 'mongodb'
        },
        serviceTimeout: 30,
    },
};
