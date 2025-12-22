import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getColleges } from '../services/api';
import type { College } from '../types';

const CollegeList = () => {
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { uniKey } = useParams<{ uniKey: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchColleges = async () => {
            if (!uniKey) return;
            try {
                const data = await getColleges(uniKey);
                setColleges(data);
            } catch (err) {
                setError('Failed to load colleges');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, [uniKey]);

    if (loading) return <div className="text-center p-8">جارٍ التحميل...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={() => navigate('/')}
                className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                ⬅ رجوع للجامعات
            </button>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">الكليات</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map((college) => (
                    <div
                        key={college._id}
                        onClick={() => navigate(`/universities/${uniKey}/colleges/${college.key}`)}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-green-500 hover:scale-105"
                    >
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{college.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollegeList;
