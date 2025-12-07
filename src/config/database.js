import mongoose from "mongoose";
const { Schema } = mongoose;


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB;