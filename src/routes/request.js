import express from 'express';
import { userAuth } from '../middlewares/auth.js';

const requestRouter = express.Router();

//POST /sendConnectionRequest - Send Connection Request API
requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;
    console.log("Sending connection request...");
    res.send(user.firstName + " is sending the Request");
})

export default requestRouter;