import express from 'express';

import hashedPassword from '../utils/hashPassword.js';
import User from '../models/user.js';
import { validateUserSignUpData } from '../utils/validation.js'

const authRouter = express.Router();


authRouter.post('/signup', async (req, res) => {
    try {
        //validte the user 
        validateUserSignUpData(req);
        const { firstName, lastName, email } = req.body;

        //encrypt the password
        const hashedPass = await hashedPassword(req.body.password);

        // create a new instance of a user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPass
        });

        await user.save();
        res.send('User added successfully');
    } catch (error) {
        console.error('Error sending user data to DB', error);
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials!!!");
        }
        const isValidPassword = await user.validatePassword(password);

        if (isValidPassword) {

            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 24 * 3600000)
            }); // cookie valid for 24 hours

            res.send("Login Successful...");
        } else {
            throw new Error("Invalid Credentials!!!");
        }

    } catch (error) {
        res.status(400).send("something went wrong: " + error.message);
    }
})

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, 
    }).send('Logged out successfully');
})

export default authRouter;