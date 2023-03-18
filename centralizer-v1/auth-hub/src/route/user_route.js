import bcrypt from "bcrypt";
import {v4 as uuid} from 'uuid';
import jwt from 'jsonwebtoken';
import {logger} from "../logger/winson";
import {accountCreationConfirmationEmail} from "../mettods/send_email";
import User from "../classes/user_class";
export const createUserRoute = {
    path: '/api/create-user',
    method: 'post',
    handler: async (req, res) => {
        const {firstName, lastName, role, email, key, password} = req.body;
        if (key !== process.env.SIGNUP_KEY) {
            return res.status(409)
        }
        const user = new User(firstName, lastName, role, email);
        if (await user.checkIfExists()) {
            res.sendStatus(409);
            return;
        }
        try {

            await user.create(password);

            logger.info('handle request register user', {req, res, info: `A new User was registered!`})
            jwt.sign({
                    id: user.userId,
                    email,
                    role: role,
                    isVerified: user.isVerified,
                    isLocked: user.isLocked
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '5d'
                },
                (err, token) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).json({token});
                    logger.debug('handle crate new user', {req, res, info: `ID: ${user.userId}`})
                })
        } catch (err) {
            logger.error('handle request register new user and send signature', {req, res, error: err})
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    },
};
export const logInRoute = {
    path: '/api/login',
    method: 'post',
    handler: async (req, res) => {
        const {email, password} = req.body;
         const newUser = new User();
         newUser.email = email
        const user = await newUser.getUserByEmail();
        if (!user) return res.sendStatus(401);
        const {userId: userId, isVerified, passwordHash, role, isLocked} = user;
        const isCorrect = await bcrypt.compare(password, passwordHash);
        if (isCorrect) {
            jwt.sign({userId, isVerified, email, role, isLocked}, process.env.JWT_SECRET, {expiresIn: '2d'}, (err, token) => {
                if (err) res.status(500).json(err);
                res.status(200).json({token});
            })
        } else {
            res.sendStatus(401);
        }
    }
}
export const findUser = {
    path: '/api/user/:userId',
    method: 'get',
    handler: async (req, res) => {
    const user = new User();
    user.userId =req.params.userId;
    const retrievedUser = await user.getUser();
        if (retrievedUser) {
            console.log(retrievedUser, "COLLECTED USER")
          return res.status(200).json({retrievedUser});
        } else {
           return  res.status(404).json({message: 'User not found'});
        }
    }
}
export const findUsers = {
    path: '/api/users',
    method: 'get',
    handler: async (req, res) => {
        try {
            const user = new User();
            const users = await user.getAll();
            logger.error('handle request find user', {req, res, info: `Users Found successfully!!`})
            if(users){
                return res.status(200).json(users); 
            }else{
                return res.status(404).json({message: "No users found"})
            }
        } catch (err) {
            // logger.info('handle request find user', {req, res, error: err})
            console.error(err)
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }
}
export const updateUserInfoRoute = {
    path: '/api/users/:userId',
    method: 'put',
    handler: async (req, res) => {
        const {authorization} = req.headers;
        const {updates} = req.body;
        if (!authorization) {
            return res.status(401).json({message: "No authorization headers sent"});
        }
        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(401).json({message: ' Unable to verify Token'});
            const {userId} = decoded;
            const aUser = new User();
            aUser.userId = req.params.userId;
            const user = await aUser.getUser();
            if (userId !== user.userId) return res.status(403).json({message: "Not allowed to update this user data, authorization logger"});

            if(updates.hasOwnProperty('userId')) return res.status(403).json({message: "Not allowed to update userId"});
            await aUser.update(updates);
            const {email, isVerified, role} = user;
            jwt.sign({userId, email, isVerified, role},
                process.env.JWT_SECRET,
                {expiresIn: '2d'},
                (err, token) => {
                    if (err) {
                        return res.status(200).json(err);
                    }
                    res.status(200).json({token});
                })
        })
    }
}
export const verifyEmail = {
    path: '/api/verify-email/:verificationString',
    method: 'put',
    handler: async (req, res) => {
        const {verificationString} = req.params;
        const aUser = new User();
        const user = await aUser.findUserByFilter({verificationString: verificationString});
        if (!user) return res.sendStatus(401);
        const {userId, email} = user;
        const update = {isVerified: true}
        const filter = {userId: userId};
        await  aUser.findAndUpdate(filter, update);
        jwt.sign({userId, isVerified: true, email}, process.env.JWT_SECRET, {expiresIn: '2d'}, (err, token) => {
            if (err) res.status(500).json(err);
            res.status(200).json({token});
        })
    }
}
export const forgotPassword = {
    path: '/api/forgot-password/:email',
    method: 'put',
    handler: async (req, res) => {
        const {email} = req.params;
        const aUser = new User();
        const user = await aUser.findUserByFilter({email: email});
        if (!user) {

            return res.sendStatus(401);
        }
        const passwordResetCode = uuid();
        await  aUser.findAndUpdate({email: email}, {passwordResetCode: passwordResetCode});
        const findUserAgain = await aUser.findUserByFilter({passwordResetCode: passwordResetCode, email: email});

        if (findUserAgain) {
            try {
                const subject = 'Reset your BlueContent password';
                const html =  `<div>
                                    <h4 style="color: #0b79f6">Reset your BlueCMS password</h4>
                                    <div>To Reset your password, click here:
                                        <a style="color: #0b79f6" href=\`${process.env.CONSOLE_URL}/password-reset/${passwordResetCode}\`> Reset Password</a>
                                    </div>
                                </div>`
                await accountCreationConfirmationEmail({to: email, subject: subject, html: html});
                res.status(200);
            } catch (e) {
                logger.error('handle send reset password email', {req, res, error: e})
                res.sendStatus(500)
            }
        }
        return res.sendStatus(200);
    }
}
export const resetPassword = {
    path: '/api/users/reset-password/:passwordResetcode',
    method: 'put',
    handler: async (req, res) => {

        const {passwordResetcode} = req.params;
        const {newPassword} = req.body;
            const aUser = new User();
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        try {
            const user = await aUser.findUserByFilter({passwordResetcode: passwordResetcode});
            if (!user) {
                return res.sendStatus(404)
            }
            await aUser.findAndUpdate({passwordResetcode: passwordResetcode}, {
                passwordHash: newPasswordHash,
                passwordResetcode: ''
            });

            res.status(200)
        } catch (e) {
            return res.status(401);
        }
        res.sendStatus(200)
    }
}

// TODO : Create Delete/ deactivate User Route. 