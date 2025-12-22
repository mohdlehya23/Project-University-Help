import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUniversities } from '../services/api';
import type { University } from '../types';

const UniversityList = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const data = await getUniversities();
                setUniversities(data);
                setFilteredUniversities(data);
            } catch (err) {
                setError('Failed to load universities');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    useEffect(() => {
        const filtered = universities.filter((uni) =>
            uni.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUniversities(filtered);
    }, [searchTerm, universities]);

    if (loading) return <div className="text-center p-8">جارٍ التحميل...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">🎓 جامعات غزة</h1>

            {/* Search Bar */}
            <div className="mb-6 max-w-2xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 ابحث عن جامعة..."
                    className="w-full p-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUniversities.map((uni) => (
                    <div
                        key={uni._id}
                        onClick={() => navigate(`/universities/${uni.key}`)}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-r-4 p-6"
                        style={{ borderTopColor: uni.color }}
                    >
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{uni.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UniversityList;
