import express from 'express';
import bcrypt from "bcrypt";

import { userAuth } from '../middlewares/auth.js';
import { validateEditProfileData } from '../utils/validation.js';

const profileRouter = express.Router();

//GET own profile - GET /profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (error) {
        res.status(400).send("Error fetching profile: " + error.message);
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("!Invalid data for profile edit");
        }

        const LoggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (LoggedInUser[key] = req.body[key]));

        await LoggedInUser.save();
        res.json({message: `${LoggedInUser.firstName} your profile has been updated successfully`});

    } catch (error) {
        res.status(400).send('Error editing profile: ' + error.message)
    }
})

profileRouter.patch('/profile/password', userAuth, async(req,res)=>{
    try {

        const {currentPassword,newPassword} = req.body;

        if(!currentPassword || !newPassword){
            throw new Error("!Please provide current and new password");
        }

        //checking current password
        const isMatchingPassword = await bcrypt.compare(currentPassword, req.user.password);
        if(!isMatchingPassword){
            throw new Error("!Current password is incorrect");
        }

        //Hash the new Password
        const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        req.user.password = newHashedPassword;

        await req.user.save();
        res.json({message: `Password updated successfully`});

    } catch (error) {
        res.status(400).send('Error updating password: ' + error.message)
    }
})

export default profileRouter;