const { Scheme, model } = require('mongoose');


const userScheme = new Scheme({
    username: { type: String, require: true, minlength: [3, 'Username must be at least 3 characters long'] },
    hashedPassword: { type: String, require: true },
    roles: { type: [{ type: String, enum: ['user', 'admin'] }], default: ['user'] }
});

userScheme.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userScheme);

module.exports = User;