const { Schema, model, Types } = require("mongoose");


const URL_PATTERN = /^https?:\/\/.+$/i;

const courseSchema = new Schema({
    title: { type: String, minlength: [4, 'Course title must be at least 4 characters long'] },
    description: {
        type: String,
        minlength: [20, 'Course description must be at least 20 characters long'],
        maxlength: [50, 'Course description must be at most 50 characters long']
    },
    imageUrl: {
        type: String,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    duration: { type: String, required: [true, 'Duration is required'] },
    createdAt: { type: String, required: true, default: () => (new Date()).toString().slice(0, 24) },
    owner: { type: Types.ObjectId, ref: 'User' },
    users: { type: [Types.ObjectId], ref: 'User', default: [] },
    usersCount: { type: Number, default: 0 }
});

courseSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Course = model('Course', courseSchema);

module.exports = Course;