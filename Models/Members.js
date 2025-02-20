import mongoose from "mongoose";

const MembersSchema = new mongoose.Schema({
    memberName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        allowNull: false,
        unique: false
    },
    phone: {
        type: String,
        required: true,
    },
    memberRole: {
        type: String,
        enum: ['ProjectManager', 'Member',], 
        default: 'Member',
    },
}, {timestamps: true});

const Member = mongoose.model("Member", MembersSchema);
export default Member;
