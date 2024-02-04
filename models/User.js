import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
});

// Create the User model using the schema
export const User = mongoose.models.User
    ? mongoose.model('User') // If the model already exists, reuse it
    : mongoose.model('User', userSchema); // Otherwise, create a new model


// module.exports = { User };