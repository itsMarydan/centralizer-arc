import express from "express";
import bodyParser from 'body-parser'
import {routes} from "./src/routes";
import {logger} from "./src/logger/winson";
import {rpcServer} from "./src/rabbitmq/rpc_server";
require('dotenv').config();
const cors = require('cors');

const app = express();


app.use(cors());


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes.forEach(routing);

function routing(route) {
    app[route.method](route.path, route.handler);
}

rpcServer().then();

const PORT = parseInt(process.env.PORT) || 8080;

app.listen(PORT, () => {
    logger.info('Start Server: ', {info: `your server is running on port ${PORT} :::: GO TO: http://localhost:${PORT}/`})
});
