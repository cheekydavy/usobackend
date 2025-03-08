const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, age, gender, phone, countryCode } = req.body;
        
        
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ msg: "User already exists" });

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        user = new User({ fullName, email, password: hashedPassword, age, gender, phone, countryCode });

        
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

        
        let user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        
        res.json({ msg: "Login successful", redirect: "https://uso-red.vercel.app" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await User.find();  
        res.json(users);  
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
