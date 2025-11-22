import { mongoose } from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is an incorrect status type.`
        }
    }
}, 
{ timestamps: true }
);

connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("Cannot send a connection request to yourself!!!");
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;  