import mongoose from "mongoose";
import express from "express";
import Project from "../Models/Projects.js"; 
const router = express.Router();
import { checkAdminRole, checkMemberRole, verifyToken} from '../Middleware/authMiddleware.js'



router.post("/create-project", verifyToken, checkAdminRole, async (req, res) => {
    try {
        const { title, desc, deadline, participants, status } = req.body;
        if (!req.user || !req.user.id) {
            return res
            .status(401)
            .json({ message: "User not authenticated" });
        }

        const owner = req.user.id;
        if (!title || !desc || !deadline) {
            return res
            .status(400)
            .json({ message: "All fields are required: title, desc, deadline" });
        }

        const newProject = new Project({
            title,
            desc,
            deadline,
            owner,  
            status,
            hasTask: [],  
            participants: participants || []  
        });

        const savedProject = await newProject.save();
        res
        .status(201)
        .json({ message: "Project created successfully", project: savedProject });
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: "Internal server error" });
    }
});





// Get all projects
router.get("/get-all-projects", verifyToken, async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("owner", "name email")
            .populate("participants", "name email") 
            .sort({ createdAt: -1 }); 

        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: "Internal server error" });
    }
});



// Update project status
router.put('/update-project-status/:projectId', async (req, res) => {
    try {
        const {status } = req.body;
        const {projectId} = req.params
        if (!projectId || !status) {
            return res
            .status(400)
            .json({ message: 'Project ID and status are required' });
        }

        const validStatuses = ['Inprogress', 'Complete', 'Incomplete'];
        if (!validStatuses.includes(status)) {
            return res
            .status(400)
            .json({ message: 'Invalid status value' });
        }

        const project = await Project.findByIdAndUpdate(
            projectId,
            { status: status }, 
            { new: true, runValidators: true }
        );

        if (!project) {
            return res
            .status(404)
            .json({ message: 'Project not found' });
        }

        res
        .status(200)
        .json({ message: 'Project status updated successfully', project });
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ message: 'Internal Server Error' });
    }
});



// Get the current status of a project
router.get('/updated-project/:projectId', verifyToken, async (req, res) => {
    try {
        const { projectId } = req.params; 
        if (!projectId) {
            return res
            .status(400)
            .json({ message: 'Project ID is required' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res
            .status(404)
            .json({ message: 'Project not found' });
        }

        res.status(200).json({ 
            message: 'Project status retrieved successfully', 
            status: project.status 
        });
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ message: 'Internal Server Error' });
    }
});





// Update project deadline
router.put('/update-deadline-project/:projectId', verifyToken, checkAdminRole, async (req, res) => {
    try {
        const { deadline } = req.body;
        const {projectId} = req.params
        if (!projectId || !deadline) {
            return res
            .status(400)
            .json({ message: 'Project ID and deadline are required' });
        }

        const parsedDeadline = new Date(deadline);
        if (isNaN(parsedDeadline)) {
            return res
            .status(400)
            .json({ message: 'Invalid date format for deadline' });
        }

        const project = await Project.findByIdAndUpdate(
            projectId,
            { deadline: parsedDeadline },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res
            .status(404)
            .json({ message: 'Project not found' });
        }

        res
        .status(200)
        .json({ message: 'Project deadline updated successfully', project });
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ message: 'Internal Server Error' });
    }
});




// Get project deadline
router.get('/get-project-deadline/:taskId', verifyToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res
            .status(400)
            .json({ message: 'Project ID is required' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res
            .status(404)
            .json({ message: 'Project not found' });
        }
        res.status(200).json({
            message: 'Updated Project',
            project: {
                projectId: project._id,
                title: project.title,
                deadline: project.deadline, 
            }
        });
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ message: 'Internal Server Error' });
    }
});



// Get all projects created by project manager
router.get("/get-pm-project", verifyToken, checkAdminRole, async (req, res) => {
    try {
        const id = req.user.id;
        const projects = await Project.find({owner: id})
            .populate("owner", "name email")
            .populate("participants", "name email") 
            .sort({ createdAt: -1 }); 

        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: "Internal server error" });
    }
});



// Get all projects
router.get("/get-memeber-project", verifyToken, checkMemberRole, async (req, res) => {
    try {
        const id = req.user.id;
        const projects = await Project.find({participants: id })
            .populate("owner", "name email")
            .populate("participants", "name email") 
            .sort({ createdAt: -1 }); 

        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: "Internal server error" });
    }
});



export default router; 



