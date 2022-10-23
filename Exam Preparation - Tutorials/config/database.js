const mongoose = require('mongoose');


const CONNECTION_STRING = 'mongodb://localhost:27017/tutorials';

module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Error initializing database');
        console.error(error.message);
        process.exit(1);
    }
}