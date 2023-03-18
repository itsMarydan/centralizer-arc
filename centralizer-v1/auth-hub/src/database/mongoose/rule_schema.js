import mongoose from "mongoose-client";
import {mongooseDb} from "./mongoose-client";
const config = require('../../config')['environment'];

const ruleSchema = new mongoose.Schema({
    ruleId:{
        type: Number
    },
    ruleName:{
        type: String
    },
    description: {
        type: String
    } ,
    actions: {
        type: []
    },
    isLocked: Boolean
})

export const RuleSchema = mongooseDb.model('bc_rules', ruleSchema);