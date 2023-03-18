import express from "express";
import bodyParser from 'body-parser'
import {routes} from "./src/routes";
import {logger} from "./src/logger/winson";
import {Tests} from "./src/test/Tests";
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors());

routes.forEach(routing);
function routing(route) {
    app[route.method](route.path, route.handler);
}
// Tests();
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
    logger.info('Start Server: ', {info: `your server is running on port ${PORT} :::: GO TO: http://localhost:${PORT}/`})
});