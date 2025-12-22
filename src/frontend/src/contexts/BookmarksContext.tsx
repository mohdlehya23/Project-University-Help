import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Major } from '../types';

interface BookmarksContextType {
    bookmarks: Major[];
    toggleBookmark: (major: Major) => void;
    isBookmarked: (majorId: string) => boolean;
    bookmarksCount: number;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<Major[]>(() => {
        try {
            const saved = localStorage.getItem('bookmarks');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const toggleBookmark = (major: Major) => {
        setBookmarks(prev => {
            const exists = prev.some(b => b._id === major._id);
            if (exists) {
                return prev.filter(b => b._id !== major._id);
            } else {
                return [...prev, major];
            }
        });
    };

    const isBookmarked = (majorId: string) => {
        return bookmarks.some(b => b._id === majorId);
    };

    return (
        <BookmarksContext.Provider value={{ 
            bookmarks, 
            toggleBookmark, 
            isBookmarked,
            bookmarksCount: bookmarks.length 
        }}>
            {children}
        </BookmarksContext.Provider>
    );
};

export const useBookmarks = () => {
    const context = useContext(BookmarksContext);
    if (context === undefined) {
        throw new Error('useBookmarks must be used within a BookmarksProvider');
    }
    return context;
};
