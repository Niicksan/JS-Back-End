const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'aGf23FgTahf232HafaGj45hjh435adsfgadFjaD';

async function register(email, password, description) {
    const existing = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

    if (existing) {
        throw new Error('Email is taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        hashedPassword,
        description
    });

    return createSession(user);
}

async function login(email, password) {
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

    if (!user) {
        throw new Error('Incorrect username or password');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect username or password');
    }

    return createSession(user);
}

function createSession({ _id, email }) {
    const payload = {
        _id,
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