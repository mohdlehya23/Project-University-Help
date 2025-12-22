import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
    username: string;
    password: string;
    email?: string;
    role: 'super_admin' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    }
}, {
    timestamps: true
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);
