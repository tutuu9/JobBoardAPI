const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
     try{
        const { name, lastName, password, email } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (!lastName) {
            return res.status(400).json({ message: 'Last name is required' });
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
        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({
            name,
            lastName,
            email,
            password: passwordHash,
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
const secret = process.env.JWT_SECRET;
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({id: user.id, role: user.role}, secret, {expiresIn: '1d'});
        return res.status(200).json({
            message: 'successfully logged in',
            token
        })
    } catch (error){
        console.error(error);
        return res.status(500).json({
            message: 'Login error',
            error: error.message
        });
    }
}
module.exports = {
    registerUser,
    loginUser
};