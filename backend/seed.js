require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const sampleUsers = [
    {
        firstName: "Gvn",
        lastName: "Manideep",
        email: "manideep@example.com",
        mobile: "9876543210",
        gender: "Male",
        status: "Active",
        location: "Hyderabad"
    },
    {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        mobile: "1234567890",
        gender: "Female",
        status: "InActive",
        location: "Mumbai"
    },
    {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        mobile: "1122334455",
        gender: "Male",
        status: "Active",
        location: "New York"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Optional: Clear existing users
        // await User.deleteMany({});
        // console.log("Cleared existing users.");

        await User.insertMany(sampleUsers);
        console.log("Database seeded successfully with sample users!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
