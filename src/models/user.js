import { mongoose } from 'mongoose';
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        requied: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female"].includes(value.toLowerCase())) {
                throw new Error("Gender must be wither a male or a female");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="
    },
    about: {
        type: String,
        default: "Hey there! I am using Tinder App for Devs.",
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema);

export default User;