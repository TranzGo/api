import bcrypt from "bcrypt"
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { User } from "@/models/User";
const dbURI = process.env.CONNECTION_STRING;

export default async function handler(req, res) {
    if (!mongoose.connections[0].readyState) {
        try {
            await mongoose.connect(dbURI);
            console.log('Connected to MongoDB! (login)');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
        return res.status(400).json({ error: "Invalid input. Please provide email and password." });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ error: "Invalid email." });
        }

        // validate the password
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result === true) {
                // Return a success message or token for authentication
                return res.status(200).json({ message: "Login successful" });
            } else {
                return res.status(401).json({ error: "Incorrect password." });
            }
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}