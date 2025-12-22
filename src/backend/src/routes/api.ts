import express from 'express';
import { getUniversities, createUniversity, updateUniversity, deleteUniversity } from '../controllers/universityController';
import { getColleges, createCollege, updateCollege, deleteCollege } from '../controllers/collegeController';
import { getMajors, createMajor, getMajorDetails, updateMajor, deleteMajor } from '../controllers/majorController';
import { globalSearch } from '../controllers/searchController';
import { adminLogin, createAdmin, getAllAdmins } from '../controllers/adminController';

const router = express.Router();

// Global Search
router.get('/search', globalSearch);

// Admin routes
router.post('/admin/login', adminLogin);
router.post('/admin/register', createAdmin);
router.get('/admin/admins', getAllAdmins);

// Universities
router.get('/universities', getUniversities);
router.post('/universities', createUniversity);
router.put('/universities/:id', updateUniversity);
router.delete('/universities/:id', deleteUniversity);

// Colleges
router.get('/universities/:uniKey/colleges', getColleges);
router.post('/colleges', createCollege);
router.put('/colleges/:id', updateCollege);
router.delete('/colleges/:id', deleteCollege);

// Majors
router.get('/universities/:uniKey/colleges/:collegeKey/majors', getMajors);
router.post('/majors', createMajor);
router.get('/universities/:uniKey/colleges/:collegeKey/majors/:majorId', getMajorDetails);
router.put('/majors/:id', updateMajor);
router.delete('/majors/:id', deleteMajor);

export default router;
