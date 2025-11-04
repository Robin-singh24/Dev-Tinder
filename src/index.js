import express from 'express';
import { authAdmin } from './middlewares/auth.js';
import connectDB from './config/database.js';

import User from './models/user.js';

const app = express();

const PORT = 3000;

app.use(express.json());


app.get('/admin/getAllData', authAdmin, (req, res) => {
    res.send("Getting All Data !!!");
})

app.get('/admin/deleteAllData', authAdmin, (req, res) => {
    res.send("Deleting All Data !!!");
})

app.post('/user', (req, res) => {
    const user = req.body;
    res.send(`User ${user.firstName} ${user.lastName} added successfully!`);
})

app.delete('/user', (req, res) => {
    res.send('User deleted successfully!!!');
})

app.post('/signup', async (req, res) => {
    //create a new instance of a user
    const user = new User({
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harry@gmail.com',
        password: 'Harry123',
    });

    try {
        await user.save();
        res.send('User added successfully');
    } catch (error) {
        console.error('Error sending user data to DB', error);
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

