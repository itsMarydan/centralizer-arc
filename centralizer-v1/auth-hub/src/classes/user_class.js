import {UserSchema} from "../database/mongoose/user_schema";
import bcrypt from "bcrypt";
import {accountCreationConfirmationEmail} from "../mettods/send_email";
import {logger} from "../logger/winson";
import {v4 as uuid} from 'uuid';

export default class User{
    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get role() {
        return this._role;
    }

    set role(value) {
        this._role = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._isActive = value;
    }

    get isVerified() {
        return this._isVerified;
    }

    set isVerified(value) {
        this._isVerified = value;
    }

    get verificationString() {
        return this._verificationString;
    }

    set verificationString(value) {
        this._verificationString = value;
    }

    get passwordResetCode() {
        return this._passwordResetCode;
    }

    set passwordResetCode(value) {
        this._passwordResetCode = value;
    }

    get isLocked() {
        return this._isLocked;
    }

    set isLocked(value) {
        this._isLocked = value;
    }

    get passwordHash() {
        return this._passwordHash;
    }

    set passwordHash(value) {
        this._passwordHash = value;
    }
    constructor(firstName, lastName, role, email) {
        this._userId = this.userId
        this._isActive = true;
        this._isVerified  = false;
        this._verificationString = uuid();
        this._passwordResetCode = '';
        this._isLocked = false;
        this._passwordHash = '';
        this._firstName = firstName;
        this._lastName = lastName;
        this._role = role;
        this._email = email;

    }

    async checkIfExists() {
        const findUser = await UserSchema.findOne({email: this.email}).exec();
        return !!findUser;
    }
    async checkIfExistsByUserId(value){
        const findUser = await UserSchema.findOne({userId: value}).exec();
        return !!findUser;
    }
    async generateUserId(){
        const allUsers = await UserSchema.find().exec();
        const usersLength = allUsers.length;
        let userId = usersLength === 0 ? 10000 : 10000 + (11 * usersLength);
        while(await this.checkIfExistsByUserId(userId)){
            userId += 11
        }
        return userId;
    }

     userInstance() {

        return new UserSchema({
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
            passwordHash: this.passwordHash,
            isActive: this.isActive,
            isVerified: this.isVerified,
            verificationString: this.verificationString,
            isLocked: this.isLocked
        });
    }

    async create(password){
        this.userId = await this.generateUserId();
        this.passwordHash = await bcrypt.hash(password, 10);
        const validate = await this.checkIfExists();
        console.log("[AUTH HUB] Validate", await validate)
        if(await validate){
            return false
        }else {
            try {
                console.log('[AUTH HUB] Start Create');
                await this.userInstance().save();
                const subject = 'Verify Your BlueContent Account Email';
                const html = `<div>
                                <h4 style="color: #0b79f6">Congratulations on your new BlueContent Account!</h4>
                                <div>To verify your email, click here:
                                    <a style="color: #0b79f6" href=\`${process.env.CONSOLE_URL}/verify-email/${this.verificationString}\`> Verify Email</a>
                                </div>
                            </div>`;
                await accountCreationConfirmationEmail({to: this.email, subject: subject, html: html});
                console.log( "[AUTH HUB] End Create")

            }catch (e) {
                console.log( "[AUTH HUB]  Create User", e)
            }

        }
    }

    async getUser(){
        try{
         return await UserSchema.findOne({userId: this.userId}).exec();

        }catch (e){
            console.error("[AUTH HUB] ERROR", e)
        }
    }

    async getUserByEmail(){
        try{
            return await UserSchema.findOne({email: this.email}).exec();

        }catch (e){
            console.error("[AUTH HUB] ERROR", e)
        }
    }

    async getAll() {
        try {
            return await UserSchema.find().exec();

        } catch (e) {
            console.error("[AUTH HUB] ERROR", e)
        }
    }

    async update(updates){

            try{
                return await UserSchema.updateOne ( {userId: this.userId}, updates );
            }catch (err) {
                console.error(err)
                return false
            }

    }
   async findUserByFilter(filter){
        try{
            return await UserSchema.findOne(filter).exec();
        }catch (e) {
            console.error(e)
            return false
        }
    }
    async findAndUpdate(filter, updates){
        try{
            await UserSchema.findOneAndUpdate(filter, updates);
        }catch (e) {
            console.error(e)
            return false;
        }
    }
}