import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginProps {
    onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Hardcoded credentials
        if (email === 'admin23@gmail.com' && password === 'admin123') {
            onLogin();
            navigate('/admin-panel');
        } else {
            setError('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">تسجيل دخول المدير</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="admin23@gmail.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-center font-semibold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition"
                    >
                        دخول
                    </button>
                </form>

                <button
                    onClick={() => navigate('/')}
                    className="w-full mt-4 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                >
                    العودة للرئيسية
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
