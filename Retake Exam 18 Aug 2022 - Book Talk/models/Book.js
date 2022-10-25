const { Schema, model, Types } = require("mongoose");


const URL_PATTERN = /^https?:\/\/.+$/i;

const bookSchema = new Schema({
    title: { type: String, require: true, minLength: [2, 'Book\'s title must be at least 2 characters long'] },
    author: { type: String, require: true, minLength: [5, 'Book\'s author must be at least 5 characters long'] },
    genre: { type: String, require: true, minLength: [3, 'Book\'s genre must be at least 3 characters long'] },
    stars: {
        type: Number, require: true,
        min: [1, 'Book\'s stars must be between 1 and 5'],
        max: [5, 'Book\'s stars must be between 1 and 5']
    },
    image: {
        type: String, require: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Image URL is not valid'
        }
    },
    review: { type: String, require: true, minLength: [10, 'Book\'s review must be at least 10 characters long'] },
    owner: { type: Types.ObjectId, ref: 'User', require: true },
    users: { type: [Types.ObjectId], ref: 'User', default: [] },
});

bookSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Book = model('Book', bookSchema);

module.exports = Book;