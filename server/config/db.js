const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nexuscommerce";
        const conn = await mongoose.connect(connUri, {
            serverSelectionTimeoutMS: 4000,
            autoIndex: true,
            maxPoolSize: 10,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database] Atlas Connection Warning: ${error.message}`);
        if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("127.0.0.1")) {
            console.log("[Database] Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/nexuscommerce)...");
            try {
                const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/nexuscommerce", {
                    serverSelectionTimeoutMS: 2000
                });
                console.log(`[Database] Local MongoDB Connected: ${localConn.connection.host}`);
                return;
            } catch (localErr) {
                console.log("[Database] Operating in offline fallback mode. Database operations will use fallback mock presets.");
            }
        }
    }
};

module.exports = connectDB;
