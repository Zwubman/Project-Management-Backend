import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Referencing the Member model
      required: true,
    },
    status: {
      type: String,
      enum: ["Inprogress", "Complete", "NotStarted"],
      default: "NotStarted",
    },
    subOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"   ,
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
