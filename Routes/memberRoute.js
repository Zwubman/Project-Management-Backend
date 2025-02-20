import mongoose from "mongoose";
import express from "express";
import Member from "../Models/Members.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

//sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { memberName, email, password, phone, memberRole } = req.body;
    const existingemail = await Member.findOne({ email: email });
    if (existingemail) {
      return res.status(400).json({ message: "email already exist" });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newMember = new Member({
      memberName: req.body.memberName,
      email: req.body.email,
      phone: req.body.phone,
      memberRole: req.body.memberRole,
      password: hashPassword,
    });
    await newMember.save();
    return res.status(200).json({ message: "signUp successfully" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "internal server error" });
  }
});

//Sign In
router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({ email });

    if (!member) {
      return;
      res.status(404).json({ error: "Member not found" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: member._id,
        name: member.memberName,
        email: member.email,
        memberRole: member.memberRole,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );

    const refreshToken = jwt.sign(
      { email: member.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Cannot log in" });
  }
});

router.get("/get-members", async (req, res) => {
  try {
    const members = await Member.find();

    if (!members) {
      return;
      res.status(404).json({ error: "Member not found" });
    }

    res.json({ message: "successfully fetched users", members });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Cannot Get Members" });
  }
});

router.post("/logout", async (req, res) => {
  try {
      
    
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Cannot Get Members" });
  }
});
export default router;
