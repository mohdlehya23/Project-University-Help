import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    updateUniversity, deleteUniversity,
    updateCollege, deleteCollege,
    updateMajor, deleteMajor,
    getMajors
} from '../services/api';
import type { University, College, Major } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
    const [activeTab, setActiveTab] = useState<'universities' | 'colleges' | 'majors'>('universities');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    // Edit/Delete State
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    // Fetch universities and colleges
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [majors, setMajors] = useState<Major[]>([]);

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchMajors = async (uniKey: string, collegeKey: string) => {
        try {
            const data = await getMajors(uniKey, collegeKey);
            setMajors(data);
        } catch (error) {
            console.error('Error fetching majors:', error);
        }
    };

    const fetchUniversities = async () => {
        try {
            const response = await axios.get(`${API_URL}/universities`);
            setUniversities(response.data);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    };

    const fetchColleges = async (uniKey: string) => {
        try {
            const response = await axios.get(`${API_URL}/universities/${uniKey}/colleges`);
            setColleges(response.data);
        } catch (error) {
            console.error('Error fetching colleges:', error);
        }
    };

    // University Form
    const [uniKey, setUniKey] = useState('');
    const [uniName, setUniName] = useState('');
    const [uniColor, setUniColor] = useState('#0a4b78');
    const [uniType, setUniType] = useState<'public' | 'private'>('public');

    const handleAddUniversity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Check for duplicate key
            const isDuplicate = universities.some(uni => uni.key === uniKey);
            if (isDuplicate) {
                setMessage('❌ مفتاح الجامعة موجود مسبقاً! استخدم مفتاح فريد.');
                return;
            }

            await axios.post(`${API_URL}/universities`, { key: uniKey, name: uniName, color: uniColor, type: uniType });
            setMessage('✅ تم إضافة الجامعة بنجاح!');
            setUniKey('');
            setUniName('');
            setUniColor('#0a4b78');
            setUniType('public');
            fetchUniversities(); // Refresh list
        } catch (error: any) {
            setMessage(`❌ خطأ في إضافة الجامعة: ${error.response?.data?.message || 'خطأ غير معروف'}`);
        }
    };

    // College Form
    const [collegeKey, setCollegeKey] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [selectedUniKey, setSelectedUniKey] = useState('');

    const handleAddCollege = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/colleges`, {
                key: collegeKey,
                name: collegeName,
                universityKey: selectedUniKey
            });
            setMessage('✅ تم إضافة الكلية بنجاح!');
            setCollegeKey('');
            setCollegeName('');
        } catch (error: any) {
            setMessage(`❌ خطأ في إضافة الكلية: ${error.response?.data?.message || 'خطأ غير معروف'}`);
        }
    };

    // Major Form
    const [majorName, setMajorName] = useState('');
    const [selectedMajorUniKey, setSelectedMajorUniKey] = useState('');
    const [selectedCollegeKey, setSelectedCollegeKey] = useState('');
    const [description, setDescription] = useState('');
    const [planUrl, setPlanUrl] = useState('');
    // Admission info fields
    const [minGpa, setMinGpa] = useState('');
    const [tuitionFees, setTuitionFees] = useState('');
    const [studyYears, setStudyYears] = useState('');
    const [academicField, setAcademicField] = useState('engineering');

    // Fetch colleges when university is selected for majors
    useEffect(() => {
        if (selectedMajorUniKey) {
            fetchColleges(selectedMajorUniKey);
        } else {
            setColleges([]);
        }
    }, [selectedMajorUniKey]);

    const handleAddMajor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/majors`, {
                name: majorName,
                universityKey: selectedMajorUniKey,
                collegeKey: selectedCollegeKey,
                description,
                plan_url: planUrl,
                academic_field: academicField,
                admission_requirements: minGpa ? { min_gpa: parseFloat(minGpa) } : undefined,
                study_info: {
                    duration_years: studyYears ? parseInt(studyYears) : undefined,
                    tuition_fees: tuitionFees || undefined
                }
            });
            setMessage('✅ تم إضافة التخصص بنجاح!');
            setMajorName('');
            setDescription('');
            setPlanUrl('');
            // Optional: Don't clear college selection so user can add more majors
            // setSelectedCollegeKey(''); 
            setMinGpa('');
            setTuitionFees('');
            setStudyYears('');
            
            // Refresh list
            if (selectedMajorUniKey && selectedCollegeKey) {
                fetchMajors(selectedMajorUniKey, selectedCollegeKey);
            }
        } catch (error: any) {
            setMessage(`❌ خطأ في إضافة التخصص: ${error.response?.data?.message || 'خطأ غير معروف'}`);
        }
    };

    // Delete Handlers
    const confirmDelete = (item: any) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (activeTab === 'universities') {
                await deleteUniversity(itemToDelete._id);
                fetchUniversities();
            } else if (activeTab === 'colleges') {
                await deleteCollege(itemToDelete._id);
                fetchColleges(selectedUniKey); // Refresh college list
            } else if (activeTab === 'majors') {
                await deleteMajor(itemToDelete._id);
                if (selectedMajorUniKey && selectedCollegeKey) {
                    fetchMajors(selectedMajorUniKey, selectedCollegeKey);
                }
            }
            setMessage('✅ تم الحذف بنجاح!');
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Delete error:', error);
            setMessage('❌ حدث خطأ أثناء الحذف.');
        }
    };

    // Edit Handlers
    const startEdit = (item: any) => {
        setEditingItem({ ...item }); // Copy item
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === 'universities') {
                await updateUniversity(editingItem._id, editingItem);
                fetchUniversities();
            } else if (activeTab === 'colleges') {
                await updateCollege(editingItem._id, editingItem);
                fetchColleges(selectedUniKey);
            } else if (activeTab === 'majors') {
                await updateMajor(editingItem._id, editingItem);
                fetchMajors(selectedMajorUniKey, selectedCollegeKey);
            }
            setMessage('✅ تم التعديل بنجاح!');
            setIsEditModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Update error:', error);
            setMessage('❌ حدث خطأ أثناء التعديل.');
        }
    };

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    // Common input class for dark mode
    const inputClass = "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
    const labelClass = "block text-gray-700 dark:text-gray-200 font-semibold mb-2";
    const cardClass = "bg-white dark:bg-gray-800 p-6 rounded-lg shadow";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">لوحة التحكم</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                        >
                            العودة للرئيسية
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                            تسجيل الخروج
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('universities')}
                        className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'universities'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        الجامعات ({universities.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('colleges')}
                        className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'colleges'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        الكليات
                    </button>
                    <button
                        onClick={() => setActiveTab('majors')}
                        className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'majors'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        التخصصات
                    </button>
                </div>

                {message && (
                    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center font-semibold">
                        {message}
                    </div>
                )}

                {/* University Form */}
                {activeTab === 'universities' && (
                    <div className={cardClass}>
                        <h2 className="text-2xl font-bold mb-4">إضافة جامعة جديدة</h2>
                        <form onSubmit={handleAddUniversity} className="space-y-4">
                            <div>
                                <label className={labelClass}>مفتاح الجامعة (بالإنجليزية)</label>
                                <input
                                    type="text"
                                    value={uniKey}
                                    onChange={(e) => setUniKey(e.target.value)}
                                    placeholder="مثال: iu"
                                    required
                                    className={inputClass}
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">يجب أن يكون فريداً ومميزاً</p>
                            </div>
                            <div>
                                <label className={labelClass}>اسم الجامعة</label>
                                <input
                                    type="text"
                                    value={uniName}
                                    onChange={(e) => setUniName(e.target.value)}
                                    placeholder="مثال: الجامعة الإسلامية"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>اللون</label>
                                <input
                                    type="color"
                                    value={uniColor}
                                    onChange={(e) => setUniColor(e.target.value)}
                                    className="w-full h-12 p-1 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>نوع الجامعة</label>
                                <select
                                    value={uniType}
                                    onChange={(e) => setUniType(e.target.value as 'public' | 'private')}
                                    className={inputClass}
                                >
                                    <option value="public">حكومية</option>
                                    <option value="private">خاصة</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
                            >
                                إضافة الجامعة
                            </button>
                        </form>

                        {/* List existing universities */}
                        {universities.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xl font-bold mb-3">الجامعات الموجودة:</h3>
                                <div className="space-y-2">
                                    {universities.map((uni) => (
                                        <div
                                            key={uni._id}
                                            className="p-4 border-r-4 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center"
                                            style={{ borderRightColor: uni.color }}
                                        >
                                            <div>
                                                <p className="font-bold">{uni.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">المفتاح: {uni.key}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(uni)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                                >
                                                    تعديل
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(uni)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* College Form */}
                {activeTab === 'colleges' && (
                    <div className={cardClass}>
                        <h2 className="text-2xl font-bold mb-4">إضافة كلية جديدة</h2>
                        <form onSubmit={handleAddCollege} className="space-y-4">
                            <div>
                                <label className={labelClass}>اختر الجامعة</label>
                                <select
                                    value={selectedUniKey}
                                    onChange={(e) => {
                                        setSelectedUniKey(e.target.value);
                                        if (e.target.value) fetchColleges(e.target.value);
                                        else setColleges([]);
                                    }}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">-- اختر الجامعة --</option>
                                    {universities.map((uni) => (
                                        <option key={uni._id} value={uni.key}>
                                            {uni.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>مفتاح الكلية (بالإنجليزية)</label>
                                <input
                                    type="text"
                                    value={collegeKey}
                                    onChange={(e) => setCollegeKey(e.target.value)}
                                    placeholder="مثال: engineering"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>اسم الكلية</label>
                                <input
                                    type="text"
                                    value={collegeName}
                                    onChange={(e) => setCollegeName(e.target.value)}
                                    placeholder="مثال: كلية الهندسة"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
                                disabled={!selectedUniKey}
                            >
                                إضافة الكلية
                            </button>
                        </form>

                        {/* List existing colleges */}
                        {selectedUniKey && (
                            <div className="mt-6">
                                <h3 className="text-xl font-bold mb-3">الكليات الموجودة:</h3>
                                <div className="space-y-2">
                                    {colleges.map((college) => (
                                        <div
                                            key={college._id}
                                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center shadow-sm"
                                        >
                                            <div>
                                                <p className="font-bold">{college.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">المفتاح: {college.key}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(college)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                                >
                                                    تعديل
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(college)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {colleges.length === 0 && <p className="text-gray-500 dark:text-gray-400">لا توجد كليات مضافة لهذه الجامعة بعد.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Major Form */}
                {activeTab === 'majors' && (
                    <div className={cardClass}>
                        <h2 className="text-2xl font-bold mb-4">إضافة تخصص جديد</h2>
                        <form onSubmit={handleAddMajor} className="space-y-4">
                            <div>
                                <label className={labelClass}>اختر الجامعة</label>
                                <select
                                    value={selectedMajorUniKey}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedMajorUniKey(val);
                                        setSelectedCollegeKey(''); // Reset college
                                        if (val) fetchColleges(val);
                                        else setColleges([]);
                                        setMajors([]);
                                    }}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">-- اختر الجامعة --</option>
                                    {universities.map((uni) => (
                                        <option key={uni._id} value={uni.key}>
                                            {uni.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>اختر الكلية</label>
                                <select
                                    value={selectedCollegeKey}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedCollegeKey(val);
                                        if (selectedMajorUniKey && val) fetchMajors(selectedMajorUniKey, val);
                                        else setMajors([]);
                                    }}
                                    required
                                    disabled={!selectedMajorUniKey}
                                    className={`${inputClass} disabled:bg-gray-100 dark:disabled:bg-gray-600`}
                                >
                                    <option value="">-- اختر الكلية --</option>
                                    {colleges.map((college) => (
                                        <option key={college._id} value={college.key}>
                                            {college.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* ... Rest of form ... */}
                            <div>
                                <label className={labelClass}>اسم التخصص</label>
                                <input
                                    type="text"
                                    value={majorName}
                                    onChange={(e) => setMajorName(e.target.value)}
                                    placeholder="مثال: هندسة البرمجيات"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>الوصف (اختياري)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="نبذة عن التخصص..."
                                    rows={3}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>رابط الخطة الدراسية (اختياري)</label>
                                <input
                                    type="text"
                                    value={planUrl}
                                    onChange={(e) => setPlanUrl(e.target.value)}
                                    placeholder="https://example.com/plan.pdf أو اتركه فارغاً"
                                    className={inputClass}
                                />
                            </div>

                            {/* Admission Info Section */}
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                                <h4 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-100">📊 معلومات القبول والدراسة</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>المعدل المطلوب (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={minGpa}
                                            onChange={(e) => setMinGpa(e.target.value)}
                                            placeholder="مثال: 85"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>الرسوم (دينار/ساعة)</label>
                                        <input
                                            type="text"
                                            value={tuitionFees}
                                            onChange={(e) => setTuitionFees(e.target.value)}
                                            placeholder="مثال: 50"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>مدة الدراسة (سنوات)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={studyYears}
                                            onChange={(e) => setStudyYears(e.target.value)}
                                            placeholder="مثال: 4"
                                            className={inputClass}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className={labelClass}>المجال الأكاديمي</label>
                                        <select
                                            value={academicField}
                                            onChange={(e) => setAcademicField(e.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="engineering">هندسة</option>
                                            <option value="medical">علوم طبية</option>
                                            <option value="it">تكنولوجيا المعلومات</option>
                                            <option value="business">أعمال واقتصاد</option>
                                            <option value="arts">آداب وعلوم إنسانية</option>
                                            <option value="science">علوم</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                                disabled={!selectedCollegeKey}
                            >
                                إضافة التخصص
                            </button>
                        </form>

                        {/* List existing majors */}
                        {selectedMajorUniKey && selectedCollegeKey && (
                            <div className="mt-6">
                                <h3 className="text-xl font-bold mb-3">التخصصات الموجودة:</h3>
                                <div className="space-y-2">
                                    {majors.map((major) => (
                                        <div
                                            key={major._id}
                                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center shadow-sm"
                                        >
                                            <div>
                                                <p className="font-bold">{major.name}</p>
                                                {major.plan_url && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">خطة دراسية</span>}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(major)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                                >
                                                    تعديل
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(major)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {majors.length === 0 && <p className="text-gray-500 dark:text-gray-400">لا توجد تخصصات مضافة لهذه الكلية بعد.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* Edit Modal */}
                {isEditModalOpen && editingItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">تعديل العنصر</h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className={labelClass}>الاسم</label>
                                    <input
                                        type="text"
                                        value={editingItem.name}
                                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                {activeTab === 'universities' && (
                                    <>
                                        <div>
                                            <label className={labelClass}>المفتاح</label>
                                            <input
                                                type="text"
                                                value={editingItem.key}
                                                onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })}
                                                className={inputClass}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>اللون</label>
                                            <input
                                                type="color"
                                                value={editingItem.color || '#000000'}
                                                onChange={(e) => setEditingItem({ ...editingItem, color: e.target.value })}
                                                className="w-full h-12 p-1 border border-gray-300 dark:border-gray-600 rounded-lg"
                                            />
                                        </div>
                                    </>
                                )}

                                {(activeTab === 'colleges' || activeTab === 'majors') && (
                                    <div>
                                        <label className={labelClass}>المفتاح (اختياري للكليات)</label>
                                        <input
                                            type="text"
                                            value={editingItem.key || ''}
                                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })}
                                            className={inputClass}
                                        />
                                    </div>
                                )}

                                {activeTab === 'majors' && (
                                    <>
                                        <div>
                                            <label className={labelClass}>الوصف</label>
                                            <textarea
                                                value={editingItem.description || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                                className={inputClass}
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>رابط الخطة</label>
                                            <input
                                                type="text"
                                                value={editingItem.plan_url || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, plan_url: e.target.value })}
                                                className={inputClass}
                                                placeholder="https://example.com/plan.pdf"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="w-full bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        حفظ التغييرات
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {isDeleteModalOpen && itemToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full text-center">
                            <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">تأكيد الحذف</h2>
                            <p className="mb-6 text-gray-700 dark:text-gray-300">هل أنت متأكد أنك تريد حذف <span className="font-bold">"{itemToDelete.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full bg-gray-300 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-400"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
