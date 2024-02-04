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
            console.log('Connected to MongoDB! (register)');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { fullName, email, phoneNumber, password } = req.body;

    // Validate user input
    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: "Invalid input. Please provide fullName, email, phoneNumber, and password." });
    }

    try {
        // Check if the user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ fullName, email, phoneNumber, password: hashedPassword });

        // Save the new user to the database
        await newUser.save();

        return res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}