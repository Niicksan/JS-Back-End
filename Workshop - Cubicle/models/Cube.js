const { Schema, model, Types } = require('mongoose');


const URL_REGEX = /^(https?:\/)?\/.*/i;

const cubeSchema = new Schema({
    name: { type: String, required: true, minlength: [3, 'Name must be at least 3 characters long'] },
    description: { type: String, required: true, minlength: [10, 'Description must be at least 10 characters long'] },
    imageUrl: {
        type: String, required: true, validate: {
            validator: (value) => URL_REGEX.test(value),
            message: (props) => {
                return `${props.value} is not a valid image URL`;
            }
        }
    },
    difficultyLevel: { type: Number, required: true, min: 1, max: 100 },
    accessories: { type: [Types.ObjectId], default: [], ref: 'Accessory' },
    owner: { type: Types.ObjectId, ref: 'User', required: true }
});

const Cube = model('Cube', cubeSchema);

module.exports = Cube;