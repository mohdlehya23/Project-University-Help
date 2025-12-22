import mongoose from 'mongoose';
import dotenv from 'dotenv';
import University from '../models/University';
import College from '../models/College';
import Major from '../models/Major';

dotenv.config();

/**
 * Add Text Indexes to Collections for Faster Search
 * 
 * This script creates text indexes on the 'name' field of all collections
 * to enable faster text-based searches.
 */

const addSearchIndexes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gaza_uni_portal');
        console.log('✅ Connected to MongoDB');

        // Add text index to Universities
        await University.collection.createIndex({ name: 'text' });
        console.log('✅ Created text index on Universities.name');

        // Add text index to Colleges
        await College.collection.createIndex({ name: 'text' });
        console.log('✅ Created text index on Colleges.name');

        // Add text index to Majors
        await Major.collection.createIndex({ name: 'text' });
        console.log('✅ Created text index on Majors.name');

        // Add compound indexes for filtering
        await Major.collection.createIndex({ academic_field: 1 });
        console.log('✅ Created index on Majors.academic_field');

        await University.collection.createIndex({ type: 1 });
        console.log('✅ Created index on Universities.type');

        console.log('\n🎉 All indexes created successfully!');
        console.log('Search performance should now be significantly faster.');

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Run the script
addSearchIndexes();
