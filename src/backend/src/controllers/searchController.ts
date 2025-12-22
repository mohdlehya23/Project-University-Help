import { Request, Response } from 'express';
import University from '../models/University';
import College from '../models/College';
import Major from '../models/Major';

// Simple in-memory cache with TTL (Time To Live)
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const globalSearch = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        const type = req.query.type as string;

        if (!query) {
            return res.json({ universities: [], colleges: [], majors: [] });
        }

        // Create cache key
        const cacheKey = `${query}_${type || 'all'}`;
        
        // Check cache
        const cached = searchCache.get(cacheKey);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < CACHE_TTL) {
            console.log(`✅ Cache HIT for: "${query}"`);
            return res.json(cached.data);
        }

        console.log(`⏳ Cache MISS for: "${query}" - Fetching from DB...`);

        const searchRegex = new RegExp(query, 'i');
        const results: any = { universities: [], colleges: [], majors: [] };

        if (!type || type === 'all' || type === 'university') {
            results.universities = await University.find({ name: searchRegex }).lean();
        }

        if (!type || type === 'all' || type === 'college') {
            const colleges = await College.find({ name: searchRegex }).lean();
            for (const college of colleges) {
                const university = await University.findOne({ key: college.universityKey }).lean();
                results.colleges.push({
                    ...college,
                    university: university ? { name: university.name, type: university.type, color: university.color } : null
                });
            }
        }

        if (!type || type === 'all' || type === 'major') {
            const majors = await Major.find({ name: searchRegex }).lean();
            for (const major of majors) {
                const university = await University.findOne({ key: major.universityKey }).lean();
                const college = await College.findOne({ key: major.collegeKey, universityKey: major.universityKey }).lean();
                results.majors.push({
                    ...major,
                    university: university ? { name: university.name, type: university.type, color: university.color } : null,
                    college: college ? { name: college.name } : null
                });
            }
        }

        // Store in cache
        searchCache.set(cacheKey, { data: results, timestamp: now });

        // Clean old cache entries (simple cleanup)
        if (searchCache.size > 100) {
            const entries = Array.from(searchCache.keys());
            const oldestKey = entries[0];
            if (oldestKey) {
                searchCache.delete(oldestKey);
            }
        }

        res.json(results);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
