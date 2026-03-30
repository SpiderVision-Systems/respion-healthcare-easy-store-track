import mongoose from "mongoose";

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        // console.log(`Already connected to MongoDB: ${mongoose.connection.name}`);
        return mongoose.connection; // ✅ Returns the existing connection
    }

    const dbUri = process.env.LIVE_MONGO_URL_MAIN;

    if (!dbUri) {
        throw new Error("Please define the MONGO_URL_MAIN environment variable");
    }

    try {
        // Close previous connection if needed
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            // console.log("Closed previous MongoDB connection");
        }

        // ✅ Connect and return `mongoose.connection` directly
        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 100000,
        });

        // console.log("Connected to MongoDB");
        // console.log(`Active Connections: ${mongoose.connections.length}`);

        return mongoose.connection; // ✅ Ensure the correct connection object is returned
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw new Error("MongoDB connection failed");
    }
};

export default connectToDatabase;
