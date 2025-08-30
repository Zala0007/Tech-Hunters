// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const PORT = process.env.PORT || 3000;
        console.log(`MongoDB Connected: ${conn.connection.host} on port ${PORT}`);
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); // Exit on DB connection failure
    }
};

module.exports = connectDB;

