const User = require('../models/User');
const registerUser = async (req, res) => {
     try{
        const { name, lastName, password, email, role } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (!lastName) {
            return res.status(400).json({ message: 'lastname is required' });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        await User.create({
            name,
            lastName,
            email,
            password,
            role: "user"
        })
         return res.status(201).json({
             message: 'user created successfully'
         });
    } catch (error){
         console.error(error);
         return res.status(500).json({ message: error.message });
     }
};

module.exports = {
    registerUser
};