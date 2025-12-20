import { useNavigate } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarksContext';

const BookmarksPage = () => {
    const { bookmarks, toggleBookmark } = useBookmarks();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">⭐ المفضلة</h1>

            {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">لا يوجد تخصصات في المفضلة</h2>
                    <p className="mt-2 text-gray-500">تصفح التخصصات وقم بإضافتها هنا للرجوع إليها لاحقاً.</p>
                    <button 
                        onClick={() => navigate('/search')}
                        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        🔍 بحث عن تخصص
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((major) => (
                        <div 
                            key={major._id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative border-t-4 border-yellow-400 transition-transform hover:-translate-y-1"
                        >
                            <button
                                onClick={() => toggleBookmark(major)}
                                className="absolute top-4 left-4 text-2xl hover:scale-110 transition-transform"
                                title="إزالة من المفضلة"
                            >
                                ⭐
                            </button>
                            
                            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{major.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{major.description}</p>
                            
                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => navigate(`/universities/${major.universityKey}/colleges/${major.collegeKey}`)} 
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition w-full"
                                >
                                    عرض التفاصيل ⬅️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookmarksPage;
