const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function registerUser({ username, password, role }) {
    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    return await newUser.save();
}

async function loginUser({ username, password }) {
    const user = await User.findOne({ username });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return { token, user };
}

module.exports = {
    registerUser,
    loginUser
};
