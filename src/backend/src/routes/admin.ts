import express from 'express';
import { adminLogin, createAdmin, getAllAdmins } from '../controllers/adminController';

const router = express.Router();

// Admin login - POST /api/admin/login
router.post('/login', adminLogin);

// Create new admin (for initial setup) - POST /api/admin/register
router.post('/register', createAdmin);

// Get all admins (for management) - GET /api/admin/admins
router.get('/admins', getAllAdmins);

export default router;
