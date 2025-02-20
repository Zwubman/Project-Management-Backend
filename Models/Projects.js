import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Inprogress', 'Complete', 'Incomplete'],
        default: 'Incomplete'
    },
    deadline:{
        type: Date,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member', 
        required: true
    },
    hasTask: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', 
        default: []
    }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member', 
        default: []
    }]
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
