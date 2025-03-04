const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, age, gender, phone, countryCode } = req.body;
        
        // Check if the user already exists
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ msg: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        user = new User({ fullName, email, password: hashedPassword, age, gender, phone, countryCode });

        // Save user to the database
        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        let user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Login successful, send success message
        res.json({ msg: "Login successful", redirect: "https://uso-red.vercel.app" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Fetch all users (for debugging or checking the database)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();  // Retrieve all users from the database
        res.json(users);  // Send the data as a response
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
