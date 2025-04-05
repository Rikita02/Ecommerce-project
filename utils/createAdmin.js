const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ email: "princek1994@gmail.com" });

        if (existingAdmin) {
            console.log("Admin user already exists.");
            mongoose.connection.close();
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10); // Set your admin password
        const adminUser = new User({
            name: "Admin",
            email: "princek1994@gmail.com",
            password: hashedPassword,
            isAdmin: true,  // Ensure this field is present in the User schema
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error creating admin user:", error);
        mongoose.connection.close();
    }
};

// Run function
createAdminUser();
