import mongoose from "mongoose-client";
import {mongooseDb} from "./mongoose-client";
const config = require('../../config')['environment'];

const policySchema = new mongoose.Schema({
    policyId:{
        type : Number
    },
    policyName:{
        type: String
    },
    policyDisplay : {
        type: String
    },
    description : {
        type: String
    },
    rules : {
        type: []
    },
    accessLevel : {
        type: String
    },
    apps : {
        type: []
    }
});
// mongoose-client.Promise = global.Promise;
// mongoose-client.connect(config.db.url, {
//     useNewUrlParser: true,
//     user: config.db.user,
//     pass: config.db.pwd
// }).then(() => {
//     console.log('successfully connected to the database');
// }).catch(err => {
//     console.log('error connecting to the database', err);
//     process.exit();
// })
// // mongoose-client.connect(`${config.db.url}/${config.db.database}`).then();
// const db = mongoose-client.connection.useDb(config.db.database);
export const PolicySchema = mongooseDb.model('bc_policies', policySchema);
