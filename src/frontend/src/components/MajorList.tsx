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
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">التخصصات</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {majors.map((major) => (
                    <div
                        key={major._id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500"
                    >
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{major.name}</h2>
                        {major.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{major.description}</p>
                        )}
                        
                        {/* Admission & Study Info */}
                        <div className="mt-3 space-y-2">
                            {major.admission_requirements?.min_gpa && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded font-semibold">
                                        📊 المعدل: {major.admission_requirements.min_gpa}%
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2 text-sm">
                                {major.study_info?.duration_years && (
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                        ⏱️ {major.study_info.duration_years} سنوات
                                    </span>
                                )}
                                {major.study_info?.tuition_fees && (
                                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                        💰 {major.study_info.tuition_fees} دينار/ساعة
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {major.study_info?.degree_type && (
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-2">
                                {major.study_info.degree_type}
                            </p>
                        )}
                        {major.plan_url && (
                            <a
                                href={major.plan_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                📄 عرض الخطة الدراسية
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MajorList;
