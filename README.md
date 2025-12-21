# 🎓 Gaza Universities Majors System

A comprehensive web application for exploring university majors in Gaza, featuring an admin panel for data management and advanced search capabilities.

## ✨ Features

### User Features
- **📚 Browse Universities & Majors**: Explore universities, colleges, and academic programs
- **🔍 Advanced Search**: 
  - Search by university, college, or major name
  - Filter by university type (Public/Private)
  - Filter by academic field (Engineering, Medical, IT, Business, Arts, Science)
- **⭐ Bookmarks System**: Save favorite majors for quick access (stored in browser)
- **🌓 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **🔐 Secure Admin Panel**: Protected login system
- **➕ Add/Edit/Delete**: Manage universities, colleges, and majors
- **📊 Admission Requirements**: Set min GPA, tuition fees, study duration
- **🏛️ University Classification**: Mark universities as Public or Private
- **🎯 Academic Field Tagging**: Categorize majors by academic field
- **💾 Persistent Sessions**: Admin stays logged in across page refreshes

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS v4** for styling
- **Context API** for state management (Theme, Bookmar
ks)

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **RESTful API** architecture

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Project University Help"
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd src/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

Create `.env` file in `src/backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Create `.env` file in `src/frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Run the application**

**Option 1: Development Mode**
```bash
# Terminal 1 - Backend
cd src/backend
npm run dev

# Terminal 2 - Frontend
cd src/frontend
npm run dev
```

**Option 2: Using Docker** (Recommended for production)
```bash
docker-compose up -d
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:5173/admin-panel

## 📖 API Endpoints

### Universities
- `GET /api/universities` - Get all universities
- `POST /api/universities` - Create university (Admin)
- `PUT /api/universities/:id` - Update university (Admin)
- `DELETE /api/universities/:id` - Delete university (Admin)

### Colleges
- `GET /api/universities/:uniKey/colleges` - Get colleges by university
- `POST /api/colleges` - Create college (Admin)
- `PUT /api/colleges/:id` - Update college (Admin)
- `DELETE /api/colleges/:id` - Delete college (Admin)

### Majors
- `GET /api/universities/:uniKey/colleges/:collegeKey/majors` - Get majors
- `POST /api/majors` - Create major (Admin)
- `PUT /api/majors/:id` - Update major (Admin)
- `DELETE /api/majors/:id` - Delete major (Admin)

### Search
- `GET /api/search?query=<term>&type=<all|university|college|major>` - Global search

### Admin
- `POST /api/admin/login` - Admin login

## 🗂️ Data Models

### University
```typescript
{
  key: string;           // Unique identifier (e.g., "iu")
  name: string;          // University name
  color: string;         // Brand color (hex)
  type: 'public' | 'private';  // University type
}
```

### College
```typescript
{
  key: string;           // Unique identifier
  name: string;          // College name
  universityKey: string; // Reference to university
}
```

### Major
```typescript
{
  name: string;
  universityKey: string;
  collegeKey: string;
  description?: string;
  plan_url?: string;
  academic_field?: string;  // engineering, medical, it, business, arts, science
  study_info?: {
    duration_years?: number;
    tuition_fees?: number;
  };
  admission_requirements?: {
    min_gpa?: number;  // 0-100 scale
  };
}
```

## 🔒 Admin Panel

**Default Credentials** (Change in production!):
- Username: `admin`
- Password: `admin123`

### Admin Features
1. **Universities**: Add, edit, delete universities with type classification
2. **Colleges**: Manage colleges under each university
3. **Majors**: Full CRUD operations with:
   - Admission requirements (Min GPA %)
   - Study info (Duration, Fees per credit hour)
   - Academic field categorization
   - Study plan URL

## 🐳 Docker Deployment

The project includes Docker configuration for easy deployment:

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- **frontend**: React app (port 5173)
- **backend**: Express API (port 5000)
- **mongodb**: MongoDB database (port 27017)

## 📁 Project Structure

```
Project University Help/
├── src/
│   ├── backend/          # Express API
│   │   ├── src/
│   │   │   ├── models/   # Mongoose models
│   │   │   ├── routes/   # API routes
│   │   │   └── controllers/
│   │   └── package.json
│   └── frontend/         # React app
│       ├── src/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── services/
│       │   └── types/
│       └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🎨 Features in Detail

### Bookmarks System
- Bookmark favorite majors with a single click
- Persist bookmarks in browser localStorage
- View all bookmarked majors in dedicated page
- Real-time bookmark counter in navbar

### Advanced Search
- Debounced search (300ms delay)
- Filter by entity type (universities/colleges/majors)
- Filter by university type (public/private)
- Filter by academic field
- Highlighted search results

### Dark Mode
- System-wide theme toggle
- Persists user preference
- Smooth transitions between themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ for Gaza Universities

## 🐛 Known Issues

None at the moment! Report issues on GitHub.

## 🔜 Roadmap

- [ ] User authentication system
- [ ] University comparisons
- [ ] Career path suggestions
- [ ] Student reviews and ratings
- [ ] Mobile app (React Native)

---

**Made with 🎓 for students in Gaza**
