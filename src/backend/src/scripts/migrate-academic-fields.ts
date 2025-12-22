import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Major from '../models/Major';

dotenv.config();

/**
 * Migration Script: Add academic_field to existing majors
 * 
 * This script updates all majors in the database that don't have
 * an academic_field set, defaulting them to 'engineering'.
 */

const updateMajorsWithAcademicField = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gaza_uni_portal');
        console.log('✅ Connected to MongoDB');

        // Find all majors without academic_field
        const majorsWithoutField = await Major.find({
            $or: [
                { academic_field: { $exists: false } },
                { academic_field: null },
                { academic_field: '' }
            ]
        });

        console.log(`📊 Found ${majorsWithoutField.length} majors without academic_field`);

        if (majorsWithoutField.length === 0) {
            console.log('✅ All majors already have academic_field set!');
            process.exit(0);
        }

        // Display majors that will be updated
        console.log('\n📝 Majors to be updated:');
        majorsWithoutField.forEach((major, index) => {
            console.log(`${index + 1}. ${major.name} (ID: ${major._id})`);
        });

        console.log('\n🔄 Updating majors with default academic_field...');

        // Update logic based on major name
        let updated = 0;
        for (const major of majorsWithoutField) {
            let field = 'engineering'; // Default

            const name = major.name.toLowerCase();
            
            // Determine field based on name
            if (name.includes('طب') || name.includes('صحة') || name.includes('تمريض') || name.includes('صيدلة')) {
                field = 'medical';
            } else if (name.includes('هندسة') || name.includes('حاسوب') || name.includes('برمجة') || name.includes('كهرباء')) {
                field = 'engineering';
            } else if (name.includes('إدارة') || name.includes('اقتصاد') || name.includes('محاسبة') || name.includes('تجارة')) {
                field = 'business';
            } else if (name.includes('فن') || name.includes('تصميم') || name.includes('إعلام')) {
                field = 'arts';
            } else if (name.includes('علوم') || name.includes('رياضيات') || name.includes('فيزياء') || name.includes('كيمياء')) {
                field = 'science';
            } else if (name.includes('تكنولوجيا') || name.includes('معلومات')) {
                field = 'it';
            }

            major.academic_field = field;
            await major.save();
            updated++;
            console.log(`  ✓ Updated: ${major.name} → ${field}`);
        }

        console.log(`\n✅ Successfully updated ${updated} majors!`);
        console.log('\n💡 Note: Please review the auto-assigned fields in MongoDB Compass');
        console.log('   and manually correct any misclassifications.');

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Run the migration
updateMajorsWithAcademicField();
