import express from 'express';

import { userAuth } from '../middlewares/auth.js';
import ConnectionRequest from '../models/connectionRequest.js';
import User from '../models/user.js';

const requestRouter = express.Router();

//POST /sendConnectionRequest - Send Connection Request API
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedFields = ["interested", "ignored"];
        if (!allowedFields.includes(status)) {
            throw new Error(`${status} is an invalid status type.`);
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User not FOUND!!!"
            });
        };

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });

        if (existingRequest) {
            throw new Error(`Connect request is already present.`);
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: 'Connection request has been sent Successfully',
            data
        })

    } catch (error) {
        res.status(400).send('Error sending Request: ' + error.message)
    }
})

export default requestRouter;