import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMajors } from '../services/api';
import type { Major } from '../types';

const MajorList = () => {
    const [majors, setMajors] = useState<Major[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { uniKey, collegeKey } = useParams<{ uniKey: string; collegeKey: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMajors = async () => {
            if (!uniKey || !collegeKey) return;
            try {
                const data = await getMajors(uniKey, collegeKey);
                setMajors(data);
            } catch (err) {
                setError('Failed to load majors');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMajors();
    }, [uniKey, collegeKey]);

    if (loading) return <div className="text-center p-8">جارٍ التحميل...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={() => navigate(`/universities/${uniKey}`)}
                className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                ⬅ رجوع للكليات
            </button>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">التخصصات</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {majors.map((major) => (
                    <div
                        key={major._id}
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{major.name}</h2>
                        {major.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">{major.description}</p>
                        )}
                        {major.study_info?.degree_type && (
                            <p className="text-indigo-600 font-semibold mt-2">
                                {major.study_info.degree_type}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MajorList;
