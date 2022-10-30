const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'aGf23FgTahf232HafaGj45hjh435adsfgadFjaD';

async function register(username, email, password) {
    const existingUsername = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });

    if (existingUsername) {
        throw new Error('Username is taken');
    }

    const existingEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

    if (existingEmail) {
        throw new Error('Email is taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        hashedPassword
    });

    return createSession(user);
}

async function login(email, password) {
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect email or password');
    }

    return createSession(user);
}

function createSession({ _id, username, email }) {
    const payload = {
        _id,
        username,
        email
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '4h'
    });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    register,
    login,
    verifyToken
};