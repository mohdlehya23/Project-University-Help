import { Request, Response } from 'express';
import Major from '../models/Major';

export const getMajors = async (req: Request, res: Response) => {
    try {
        const { uniKey, collegeKey } = req.params;
        const majors = await Major.find({ universityKey: uniKey, collegeKey: collegeKey });
        res.json(majors);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createMajor = async (req: Request, res: Response) => {
    try {
        const major = new Major(req.body);
        const savedMajor = await major.save();
        res.status(201).json(savedMajor);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getMajorDetails = async (req: Request, res: Response) => {
    try {
        const { uniKey, collegeKey, majorId } = req.params;
        const major = await Major.findOne({ _id: majorId, universityKey: uniKey, collegeKey: collegeKey });
        if (!major) return res.status(404).json({ message: 'Major not found' });
        res.json(major);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMajor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedMajor = await Major.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMajor) {
            return res.status(404).json({ message: 'Major not found' });
        }
        res.json(updatedMajor);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMajor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedMajor = await Major.findByIdAndDelete(id);
        if (!deletedMajor) {
            return res.status(404).json({ message: 'Major not found' });
        }
        res.json({ message: 'Major deleted successfully', major: deletedMajor });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
