const { Schema, model, Types } = require('mongoose');


const URL_REGEX = /^(https?:\/)?\/.*/i;

const accessorySchema = new Schema({
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
    cubes: { type: [Types.ObjectId], default: [], ref: 'Cube' }
});

const Accessory = model('Accessory', accessorySchema);

module.exports = Accessory;