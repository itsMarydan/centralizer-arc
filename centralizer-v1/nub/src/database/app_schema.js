import mongoose from "mongoose";
import {mongooseDb} from "./mongoose-client";
const config = require('../config')['environment'];

const appSchema = new mongoose.Schema({
    appName: {
        type: String
    },
    appSlug: {
        type: String,
    },
    appId: {
        type: String,
    },
    appStatus: {
        type: Number,
    },
    appSecrets: {
        type: []
    },
    appManager:{
        type: Number,
    },
    appDatabase: {
       type: String
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
        type: Number,
    },
    lastModified: {
        type: Date,
        default: new Date()
    }
})


export const AppSchema = mongooseDb.model('bc_applications', appSchema);


