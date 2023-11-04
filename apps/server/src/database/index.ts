import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri!);
        console.log("Connected to MongoDB using Mongoose!");
    } catch (error) {
        console.error("Failed to connect to the database!", error);
        process.exit(1);
    }
};

export { connectDB };
