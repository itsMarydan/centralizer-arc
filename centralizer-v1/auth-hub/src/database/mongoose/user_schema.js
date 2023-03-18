import mongoose from "mongoose-client";
import {mongooseDb} from "./mongoose-client";
const config = require('../../config')['environment'];

const userSchema = new mongoose.Schema({
    userId:{
        type: Number
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    role: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
    isVerified:{
        type: Boolean
    },
    verificationString: {
        type: String,
    },
    passwordResetcode: {
        type: String,
    },
    isLocked:{
        type: Boolean
    },
    passwordHash: {
        type: String,
    }
})


export const UserSchema = mongooseDb.model('bc_users', userSchema);


