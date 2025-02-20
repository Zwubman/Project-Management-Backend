import dotenv from "dotenv";
import express from "express";
import "./Connections/Conn.js";
import cors from "cors";
import Member from "./Models/Members.js";
import Project from "./Models/Projects.js";
import Tasks from "./Models/Tasks.js";
import memberRoute from "./Routes/memberRoute.js";
import memberProject from "./Routes/projectRoute.js";
import memberTask from "./Routes/taskRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", memberRoute);
app.use("/api/projects", memberProject);
app.use("/api/tasks", memberTask);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server started on port ${port}`);
});
