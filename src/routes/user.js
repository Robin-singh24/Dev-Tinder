import express from 'express';

import { userAuth } from '../middlewares/auth.js';
import ConnectionRequest from '../models/connectionRequest.js';
import User from '../models/user.js';

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about";

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row) => row.fromUserId);
        res.json({ message: "Data fetched successfully", data })

    } catch (error) {
        res.status(400).send("fetching data failed" + error.message);
    }
});


userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser, status: "accepted" },
                { fromUserId: loggedInUser, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);;

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() ===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        });

        res.json({ data });

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

userRouter.get('/user/feed', userAuth, async(req,res)=>{
    try {

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        limit = Math.min(limit,10); // max limit 20
        const skipUsers = (page-1)*limit;

        const connectionRequest = await ConnectionRequest.find({
            $or :[
                {toUserId : loggedInUser._id},
                {fromUserId : loggedInUser._id}
            ]
        }).select("toUserId fromUserId");

        const hiddenUsersFromFeed = new Set();

        connectionRequest.forEach(req=>{
            hiddenUsersFromFeed.add(req.toUserId.toString());
            hiddenUsersFromFeed.add(req.fromUserId.toString());
        });

        const users = await User.find({
           $and : [ {_id : {$nin : Array.from(hiddenUsersFromFeed)}}, {_id : {$ne:loggedInUser._id}}]
        }).select(USER_SAFE_DATA).skip(skipUsers).limit(limit);

        res.json({data: users});

    } catch (error) {
        res.status(400).send({message: error.message});
    }
});

export default userRouter; 