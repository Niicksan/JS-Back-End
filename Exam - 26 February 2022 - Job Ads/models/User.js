const { Schema, model, Types } = require("mongoose");


const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    description: { type: String, required: true, maxlength: [40, 'Description must be the most 40 characters long'] },
    myAds: { type: [Types.ObjectId], ref: 'Ad', default: [] }
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