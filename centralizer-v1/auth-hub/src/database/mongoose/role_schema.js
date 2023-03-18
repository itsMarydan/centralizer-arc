import mongoose from "mongoose-client";
import {mongooseDb} from "./mongoose-client";
const config = require('../../config')['environment'];

const roleSchema = new mongoose.Schema({
    roleId:{
        type: Number,
    },
    roleName:{
        type: String
    },
    roleDisplay:{
        type: String
    },
    policies:{
        type: []
    },
    roleDelete: {
        type: Boolean
    },
    roleType:{
        type: String
    },
    role: {
        type: String,
    },
    roleCreator: {
        type: String
    },
    roleKey:{
        type: String
    }
})

// mongoose-client.connect(`${config.db.url}/${config.db.database}`).then();
export const RoleSchema = mongooseDb.model('bc_roles', roleSchema);
