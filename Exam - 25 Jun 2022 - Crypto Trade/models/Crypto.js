const { Schema, model, Types } = require("mongoose");


const URL_PATTERN = /^https?:\/\/.+$/i;

const cryptoSchema = new Schema({
    name: { type: String, required: true, unique: true, minlength: [2, 'Name must be at least 2 characters long'] },
    image: {
        type: String, require: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Image URL is not valid'
        }
    },
    price: {
        type: Number, required: true,
        min: [1, 'Price must be higher than 1']
    },
    description: { type: String, required: true, minlength: [10, 'Description must be at least 10 characters long'] },
    method: { type: String, required: true },
    owner: { type: Types.ObjectId, ref: 'User', require: true },
    users: { type: [Types.ObjectId], ref: 'User', default: [] },

});

cryptoSchema.index({ name: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

cryptoSchema.index({ owner: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Crypto = model('Crypto', cryptoSchema);

module.exports = Crypto;