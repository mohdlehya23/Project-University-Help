import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUniversities } from '../services/api';
import type { University } from '../types';

const UniversityList = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const data = await getUniversities();
                setUniversities(data);
            } catch (err) {
                setError('Failed to load universities');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    if (loading) return <div className="text-center p-8">جارٍ التحميل...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">🎓 جامعات غزة</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities.map((uni) => (
                    <div
                        key={uni._id}
                        onClick={() => navigate(`/universities/${uni.key}`)}
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-t-4"
                        style={{ borderTopColor: uni.color }}
                    >
                        <h2 className="text-xl font-bold text-gray-800">{uni.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UniversityList;
