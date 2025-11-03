import mongoose from "mongoose";
const {Schema} = mongoose;


const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://robin:robin123@devtinder.l3zmnhe.mongodb.net/DevTinder"
    );
}

export default connectDB;