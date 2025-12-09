import { mongoose } from 'mongoose';
import validator from 'validator';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("PassWord is not Strong Enough: " + value);
            }
        }
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
        default: "https://tinyurl.com/336yvy4x",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Phot URL: " + value);
            }
        }
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }//token valid for 7 days
    );
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isValidPass = await bycrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isValidPass;
}

const User = mongoose.model('User', userSchema);

export default User;