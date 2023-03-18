import {UserSchema} from "../database/mongoose/user_schema";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

export function createNewUser(firstName, lastName, email, role, password){
    const passwordHash = hashPassword(password);
    const userId = generateUserId();
    const validate = checkIfUserExists(email);
    const newUser = new UserSchema({
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        passwordHash: passwordHash,
        isActive: true,
        isVerified: false,
        verificationString:  uuid(),
        isLocked: false
    });
    if(validate){
        return false
    }else{
        return  newUser
    }

}

async function hashPassword(password) {
    return await bcrypt.hash ( password, 10 );
}

async function checkIfUserExists(email) {
    const user = await UserSchema.findOne({email: email}).exec();
    return user ? user : false;
}

async function generateUserId(){
    const allUsers = await UserSchema.find().exec();
    const usersLength = allUsers.length;
    let userId = usersLength === 0 ? 10000 : 10000 + (11 * usersLength);
    const user = await UserSchema.findOne({userId: userId}).exec();
    while(user){
        userId +=11;
    }
    return userId;
}