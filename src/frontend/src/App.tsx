import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BookmarksProvider, useBookmarks } from './contexts/BookmarksContext';
import UniversityList from './components/UniversityList';
import CollegeList from './components/CollegeList';
import MajorList from './components/MajorList';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import GlobalSearch from './components/GlobalSearch';
import BookmarksPage from './components/BookmarksPage';

const NavbarBookmarks = () => {
    const { bookmarksCount } = useBookmarks();
    return (
        <Link
            to="/bookmarks"
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold text-sm md:text-base flex items-center gap-2"
        >
            ⭐ <span className="hidden md:inline">المفضلة</span>
            {bookmarksCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {bookmarksCount}
                </span>
            )}
        </Link>
    );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-700 transition"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isAdminLoggedIn', 'true');
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  return (
    <ThemeProvider>
      <BookmarksProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200" dir="rtl">
            <header className="bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-lg sticky top-0 z-50">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Link to="/" className="text-2xl font-bold">🎓 تخصصات جامعات غزة</Link>
                </div>

                <div className="flex items-center gap-4">
                  <NavbarBookmarks />
                  <Link
                    to="/search"
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm md:text-base"
                  >
                    🔍 بحث
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <Routes>
              <Route path="/" element={<UniversityList />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/search" element={<GlobalSearch />} />
            <Route path="/universities/:uniKey" element={<CollegeList />} />
            <Route path="/universities/:uniKey/colleges/:collegeKey" element={<MajorList />} />
            <Route
              path="/admin-panel-login"
              element={<AdminLogin onLogin={handleLogin} />}
            />
            <Route
              path="/admin-panel"
              element={
                isAdminLoggedIn ? (
                  <AdminDashboard onLogout={handleLogout} />
                ) : (
                  <AdminLogin onLogin={handleLogin} />
                )
              }
            />
          </Routes>
        </div>
        </Router>
      </BookmarksProvider>
    </ThemeProvider>
  );
}

export default App;
