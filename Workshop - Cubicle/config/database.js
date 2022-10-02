const mongoose = require('mongoose');

const connStr = process.env.DATABASE_CONNECTION_STRING || 'mongodb://localhost:27017/cubicles';

module.exports = async (app) => {
    try {
        await mongoose.connect(connStr, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Error initializing database');
        console.error(error.message);
        process.exit(1);
    }
};