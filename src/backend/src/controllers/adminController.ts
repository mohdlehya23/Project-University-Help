import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

// Admin Login
export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }

        // Find admin by username
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }

        // Return success (without password)
        res.json({
            message: 'تم تسجيل الدخول بنجاح',
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create Admin (for setup/registration)
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password, email, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            email,
            role: role || 'admin'
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'تم إنشاء حساب الأدمن بنجاح',
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get all admins (optional - for super admin)
export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
