const { Schema, model, Types } = require("mongoose");


const URL_PATTERN = /^https?:\/\/.+$/i;


const blogSchema = new Schema({
    title: {
        type: String, require: true,
        minLength: [5, 'Blog\'s title must be at least 5 characters long'],
        maxLength: [50, 'Blog\'s title must be no longer than 50 characters']
    },
    image: {
        type: String, require: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Image URL is not valid'
        }
    },
    content: { type: String, require: true, minLength: [10, 'Blog\'s content must be at least 10 characters long'] },
    category: { type: String, require: true, minLength: [3, 'Blog\'s category must be at least 3 characters long'] },
    owner: { type: Types.ObjectId, ref: 'User', require: true },
    followList: { type: [Types.ObjectId], ref: 'User', default: [] },
});

blogSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Blog = model('Blog', blogSchema);

module.exports = Blog;