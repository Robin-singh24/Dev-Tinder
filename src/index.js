import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//IMPORTS FROM DB
import connectDB from './config/database.js';

//ROUTES IMPORTS
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import requestRouter from './routes/request.js';
import userRouter from './routes/user.js';

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

const PORT = 3000;
connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
}).catch((err) => {
    console.error("Database connection failed", err);
})

