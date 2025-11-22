import express from 'express';

import { userAuth } from '../middlewares/auth.js';
import ConnectionRequest from '../models/connectionRequest.js';

const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status : "interested"
        }).populate("fromUserId","firstName lastName photoUrl age gender about");

        res.json({ message: "Data fetched successfully", data: connectionRequest })

    } catch (error) {
        res.status(400).send("fetching data failed" + error.message);
    }
})


export default userRouter;