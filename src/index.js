import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http'

import './utils/cronJob.js';

// DB
import connectDB from './config/database.js';

// ROUTES
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import requestRouter from './routes/request.js';
import userRouter from './routes/user.js';
import paymentRouter from './routes/payment.js'
import initialiseSocket from './utils/socket.js'
const app = express();

// ====== CORS MUST BE APPLIED HERE ======
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],   // your Vercel URL
    credentials: true,
  })
);

// Preflight for ALL routes
app.options(/.*/, cors());

// ====== MIDDLEWARES ======
app.use(express.json());
app.use(cookieParser());

// ====== ROUTES ======
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', paymentRouter)

const server = http.createServer(app);

initialiseSocket(server)

// ====== START SERVER ======
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
