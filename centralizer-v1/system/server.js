import express from "express";
import bodyParser from 'body-parser'
import {routes} from "./src/routes";
import {logger} from "./src/logger/winson";
import {processSettingsRetrieve} from "./src/rabbitmq/rpc_server";
import {startAMQPConnectionAndWorkers} from "./src/rabbitmq/amqp_consumer";
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes.forEach(routing);

function routing(route) {
    app[route.method](route.path, route.handler);
}

const PORT = parseInt(process.env.PORT) || 8080;

startAMQPConnectionAndWorkers();
processSettingsRetrieve().then();
app.listen(PORT, () => {
    logger.info('Start Server: ', {info: `[SYSTEM ENGINE] your server is running on port ${PORT} :::: GO TO: http://localhost:${PORT}/`})
});