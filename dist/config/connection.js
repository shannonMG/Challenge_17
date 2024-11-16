import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yourdbname';
        await mongoose.connect(dbURI, {
            connectTimeoutMS: 10000, // Timeout after 10 seconds
        });
        console.log('✅ Database connected successfully.');
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1); // Exit process if unable to connect
    }
};
export default connectDB;
