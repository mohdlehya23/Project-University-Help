import { Request, Response } from 'express';
import College from '../models/College';

export const getColleges = async (req: Request, res: Response) => {
    try {
        const colleges = await College.find({ universityKey: req.params.uniKey });
        res.json(colleges);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCollege = async (req: Request, res: Response) => {
    try {
        const college = new College(req.body);
        const savedCollege = await college.save();
        res.status(201).json(savedCollege);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCollege = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCollege = await College.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCollege) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.json(updatedCollege);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCollege = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCollege = await College.findByIdAndDelete(id);
        if (!deletedCollege) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.json({ message: 'College deleted successfully', college: deletedCollege });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
