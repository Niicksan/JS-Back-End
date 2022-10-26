const { Schema, model } = require("mongoose");


const userSchema = new Schema({
    username: { type: String, required: true, unique: true, minlength: [5, 'Username must be at least 5 characters long'] },
    email: { type: String, required: true, unique: true, minlength: [10, 'Email must be at least 10 characters long'] },
    hashedPassword: { type: String, required: true }
});

userSchema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;