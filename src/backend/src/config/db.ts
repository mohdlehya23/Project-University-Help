import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Fix DNS resolution for MongoDB Atlas SRV records
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
    try {
        // MongoDB Atlas connection options for production
        const options = {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s
            socketTimeoutMS: 45000, // Close sockets after 45s
            family: 4, // Use IPv4, skip trying IPv6
        };

        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/gaza_uni_portal';
        
        console.log('🔄 Connecting to MongoDB...');
        
        const conn = await mongoose.connect(mongoURI, options);
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
    } catch (error: any) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        
        // More detailed error info for debugging
        if (error.message.includes('ESERVFAIL') || error.message.includes('querySrv')) {
            console.error('💡 DNS Error! Try these fixes:');
            console.error('   1. Use standard connection string instead of SRV (+srv)');
            console.error('   2. Check your internet connection');
            console.error('   3. Change DNS to 8.8.8.8 or 1.1.1.1');
        } else if (error.name === 'MongoServerSelectionError') {
            console.error('💡 Check: IP Whitelist in MongoDB Atlas, or MONGO_URI in .env');
        }
        
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

export default connectDB;
