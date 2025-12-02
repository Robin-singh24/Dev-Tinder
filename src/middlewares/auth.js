import jwt from "jsonwebtoken";
import User from '../models/user.js';


const userAuth = async (req, res, next) => {
    //Read the token from cookies
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).sned("Please Login!!!");
        }

        const decodedMessage = jwt.verify(token, "Dev@TinderSecret");
        // const { _id } = decodedMessage;
        const user = await User.findById(decodedMessage._id);
        if (!user) {
            throw new Error("No user found");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("ERROR : " + error.message);
    }
    //validate the token

    //Find the user
}

export { userAuth };