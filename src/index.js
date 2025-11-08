import express from 'express';
import bycrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';


//IMPORTS FROM UTILITIES
import { validateUserSignUpData } from './utils/validation.js'
import hashedPassword from './utils/hashPassword.js';
import User from './models/user.js';
import connectDB from './config/database.js';
import { userAuth } from './middlewares/auth.js';


const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

//Signup API - POST /signup
app.post('/signup', async (req, res) => {
    try {
        //validte the user 
        validateUserSignUpData(req);
        const { firstName, lastName, email } = req.body;

        //encrypt the password
        const hashedPass = await hashedPassword(req.body.password);
        console.log("Hashed Password: ", hashedPass);

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

//LOGIN API - POST /login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials!!!");
        }
        const isValidPassword = await bycrypt.compare(password, user.password);
        if (isValidPassword) {
            //jwt token to be implemented
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const token = jwt.sign({ _id: user._id }, "Dev@TinderSecret", { expiresIn: currentTimeInSeconds + (60 * 10) });//token valid for 10 minutes

            res.cookie("token", token,{ expires: new Date(Date.now() + 24 * 3600000)}); // cookie valid for 24 hours
            res.send("Login Successful...");
        } else {
            throw new Error("Invalid Credentials!!!");
        }

    } catch (error) {
        res.status(400).send("something went wrong: " + error.message);
    }
})

//GET own profile - GET /profile
app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (error) {
        res.status(400).send("Error fetching profile: " + error.message);
    }
})

//POST /sendConnectionRequest - Send Connection Request API
app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;
    console.log("Sending connection request...");
    res.send(user.firstName + " is sending the Request");
})


const PORT = 3000;
connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
}).catch((err) => {
    console.error("Database connection failed", err);
})

