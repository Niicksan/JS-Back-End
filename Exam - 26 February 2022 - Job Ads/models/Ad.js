const { Schema, model, Types } = require("mongoose");


const adSchema = new Schema({
    headline: { type: String, required: true, minLength: [4, 'Headline must be at least 4 characters long'] },
    location: { type: String, required: true, minLength: [8, 'Location must be at least 8 characters long'] },
    companyName: { type: String, required: true, minLength: [3, 'Company name must be at least 3 characters long'] },
    companyDescription: { type: String, required: true, maxlength: [40, 'Company description must be the most 40 characters long'] },
    author: { type: Types.ObjectId, ref: 'User', require: true },
    applications: { type: [Types.ObjectId], ref: 'User', default: [] },
    applicationsCount: { type: Number, default: 0 }
});

adSchema.index({ author: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Ad = model('Ad', adSchema);

module.exports = Ad;