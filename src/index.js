import express from 'express';
import { authAdmin } from './middlewares/auth.js';
import connectDB from './config/database.js';
import validator from 'validator';

import User from './models/user.js';
import { ReturnDocument } from 'mongodb';

const app = express();

const PORT = 3000;

app.use(express.json());


//Signup API - POST /signup
app.post('/signup', async (req, res) => {

    // create a new instance of a user
    const user = new User(req.body);
    try {
        await user.save();
        res.send('User added successfully');
    } catch (error) {
        console.error('Error sending user data to DB', error);
    }
})

//GET user by ID
app.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).send("No user found");
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("something went wrong", err);
    }
})

//Particular User API - GET /user - get a particular user from the database using email
app.get('/user', async (req, res) => {
    const userEmail = req.body.email;

    try {
        const users = await User.findOne({ email: userEmail })
        if (!users) {
            res.status(404).send("No user found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("something went wrong", err);
    }
})

//Feed API - GET /feed - get all users from the database 
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (error) {
        res.send("Error fetching users", error);
    }
})

//delete user API - DELETE /user
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send("No user found");
        } else {
            res.send("User deleted successfully");
        }
    } catch (error) {
        res.status(400).send("Error deleting user", error);
    }
})

//UPDATE user API - PATCH /user
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {

        const ALLOWED_UPDATES = ['lastName', 'age', 'about', 'gender', 'photoUrl', 'skills'];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data.skills && data.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        const updatedUser = await User.findByIdAndUpdate(userId, data, {
            returnDocument: true,
            runValidators: true,
        });
        if (!updatedUser) {
            res.status(404).send("No user found");
        } else {
            res.send("User updated successfully");
        }
    } catch (error) {
        res.status(400).send("Error updating user: " + error.message);
    }
})

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
}).catch((err) => {
    console.error("Database connection failed", err);
})

