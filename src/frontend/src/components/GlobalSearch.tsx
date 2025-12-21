import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBookmarks } from '../contexts/BookmarksContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SearchResults {
    universities: any[];
    colleges: any[];
    majors: any[];
}

const GlobalSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [universityType, setUniversityType] = useState('all'); // public, private, all
    const [academicField, setAcademicField] = useState('all'); // engineering, medical, etc.
    const [results, setResults] = useState<SearchResults>({ universities: [], colleges: [], majors: [] });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isBookmarked, toggleBookmark } = useBookmarks();

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch();
            } else {
                setResults({ universities: [], colleges: [], majors: [] });
            }
        }, 300); // Debounce search

        return () => clearTimeout(delaySearch);
    }, [searchQuery, searchType]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/search`, {
                params: { query: searchQuery, type: searchType }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Client-side filtering based on university type and academic field
    const filteredResults = useMemo(() => {
        let filtered = { ...results };

        // Filter universities by type
        if (universityType !== 'all') {
            filtered.universities = results.universities.filter(
                (uni: any) => uni.type === universityType
            );
        }

        // Filter majors by academic field and university type
        if (academicField !== 'all' || universityType !== 'all') {
            filtered.majors = results.majors.filter((major: any) => {
                const fieldMatch = academicField === 'all' || major.academic_field === academicField;
                const typeMatch = universityType === 'all' || major.university?.type === universityType;
                return fieldMatch && typeMatch;
            });
        }

        // Filter colleges by university type
        if (universityType !== 'all') {
            filtered.colleges = results.colleges.filter(
                (college: any) => college.university?.type === universityType
            );
        }

        return filtered;
    }, [results, universityType, academicField]);

    const totalResults = filteredResults.universities.length + filteredResults.colleges.length + filteredResults.majors.length;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">🔍 البحث المتقدم</h1>

            {/* Search Input */}
            <div className="max-w-4xl mx-auto mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن جامعة، كلية، أو تخصص..."
                    className="w-full p-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
                />
            </div>

            {/* Filter Tabs */}
            <div className="max-w-4xl mx-auto mb-6 flex gap-2 flex-wrap justify-center">
                {[
                    { value: 'all', label: 'الكل' },
                    { value: 'university', label: 'جامعات فقط' },
                    { value: 'college', label: 'كليات فقط' },
                    { value: 'major', label: 'تخصصات فقط' }
                ].map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setSearchType(filter.value)}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${searchType === filter.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Advanced Filters */}
            <div className="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع الجامعة
                    </label>
                    <select
                        value={universityType}
                        onChange={(e) => setUniversityType(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    >
                        <option value="all">الكل</option>
                        <option value="public">حكومية</option>
                        <option value="private">خاصة</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المجال الأكاديمي
                    </label>
                    <select
                        value={academicField}
                        onChange={(e) => setAcademicField(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    >
                        <option value="all">جميع المجالات</option>
                        <option value="engineering">هندسة</option>
                        <option value="medical">علوم طبية</option>
                        <option value="it">تكنولوجيا المعلومات</option>
                        <option value="business">أعمال واقتصاد</option>
                        <option value="arts">آداب وعلوم إنسانية</option>
                        <option value="science">علوم</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            {searchQuery && (
                <div className="max-w-4xl mx-auto mb-4 text-center text-gray-600">
                    {loading ? 'جارٍ البحث...' : `تم العثور على ${totalResults} نتيجة`}
                </div>
            )}

            {/* Results */}
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Universities */}
                {filteredResults.universities.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">🎓 الجامعات ({filteredResults.universities.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredResults.universities.map((uni) => (
                                <div
                                    key={uni._id}
                                    onClick={() => navigate(`/universities/${uni.key}`)}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer border-r-4"
                                    style={{ borderRightColor: uni.color }}
                                >
                                    <h3 className="font-bold text-lg">{uni.name}</h3>
                                    <p className="text-sm text-gray-600">مفتاح: {uni.key}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Colleges */}
                {filteredResults.colleges.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">🏛️ الكليات ({filteredResults.colleges.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredResults.colleges.map((college) => (
                                <div
                                    key={college._id}
                                    onClick={() => navigate(`/universities/${college.universityKey}/colleges/${college.key}`)}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                                >
                                    <h3 className="font-bold text-lg">{college.name}</h3>
                                    {college.university && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            📍 {college.university.name}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Majors */}
                {filteredResults.majors.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">📚 التخصصات ({filteredResults.majors.length})</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {filteredResults.majors.map((major) => (
                                <div
                                    key={major._id}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition relative group"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(major);
                                        }}
                                        className={`absolute top-4 left-4 text-2xl transition-transform hover:scale-110 focus:outline-none ${
                                            isBookmarked(major._id) ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'
                                        }`}
                                        title={isBookmarked(major._id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                                    >
                                        {isBookmarked(major._id) ? '⭐' : '☆'}
                                    </button>

                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{major.name}</h3>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        {major.university && <p>🎓 {major.university.name}</p>}
                                        {major.college && <p>🏛️ {major.college.name}</p>}
                                    </div>
                                    {major.description && (
                                        <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">{major.description}</p>
                                    )}
                                    {major.plan_url && (
                                        <a
                                            href={major.plan_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                                        >
                                            📄 عرض الخطة الدراسية
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {searchQuery && !loading && totalResults === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-xl">لا توجد نتائج لـ "{searchQuery}"</p>
                        <p className="mt-2">جرب البحث بكلمات مختلفة</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalSearch;
