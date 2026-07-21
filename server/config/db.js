const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nexuscommerce";
        const conn = await mongoose.connect(connUri, {
            serverSelectionTimeoutMS: 5000,
            autoIndex: true,
            maxPoolSize: 10,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database] Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
