import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const conn = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONG_URI}`);
        if (response) {
            console.log("Connected to  DB");
        }
    } catch (error) {  
        console.error("Error connecting to DB: ", error.message);
    }
};

conn();
