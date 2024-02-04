import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default async function connectToDatabase() {
    try {
        const dbURI = process.env.CONNECTION_STRING;
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB! (db)');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}