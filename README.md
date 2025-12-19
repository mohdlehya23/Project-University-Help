# Gaza Uni Portal

A professional full-stack web application for exploring higher education options in Gaza universities. Built with modern technologies following best practices for containerization and deployment.

## 🎯 Project Description

Gaza Uni Portal helps students discover and explore universities, colleges, and academic majors across Gaza. The application provides detailed information about study plans, admission requirements, tuition fees, and degree details.

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** with **Express**
- **TypeScript** - Type-safe JavaScript
- **MongoDB** with **Mongoose** - NoSQL database
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy for frontend
- **Multi-stage builds** - Optimized production images

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose
- Git

### Running with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Project University Help"
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Running Locally (Development)

#### Backend
```bash
cd src/backend
npm install
cp .env.example .env
npm run dev
```

#### Frontend
```bash
cd src/frontend
npm install
cp .env.example .env
npm run dev
```

## 📁 Project Structure

```
.
├── src/
│   ├── backend/           # Node.js backend
│   │   ├── src/
│   │   │   ├── config/    # Database configuration
│   │   │   ├── models/    # Mongoose models
│   │   │   ├── controllers/ # Route controllers
│   │   │   ├── routes/    # API routes
│   │   │   └── server.ts  # Express server
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/          # React frontend
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── services/   # API service layer
│       │   ├── types/      # TypeScript types
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
├── docs/                  # Documentation
│   ├── notes.md          # Technical notes
│   └── screenshots/      # Application screenshots
├── legacy_backup/        # Original project files
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Service orchestration
├── nginx.conf           # Nginx configuration
└── README.md            # This file
```

## 🔧 API Endpoints

### Universities
- `GET /api/universities` - List all universities
- `POST /api/universities` - Create a university

### Colleges
- `GET /api/universities/:uniKey/colleges` - List colleges by university
- `POST /api/colleges` - Create a college

### Majors
- `GET /api/universities/:uniKey/colleges/:collegeKey/majors` - List majors
- `POST /api/majors` - Create a major
- `GET /api/universities/:uniKey/colleges/:collegeKey/majors/:majorId` - Get major details

## 🐳 Docker Architecture

The application uses a multi-stage Docker build process:

1. **Backend Builder** - Installs and prepares Node.js backend
2. **Frontend Builder** - Builds optimized React production bundle
3. **Backend Production** - Lightweight Node.js runtime
4. **Frontend Production** - Nginx serving static files

### Healthcheck
The backend service includes a healthcheck endpoint that Docker monitors:
- Endpoint: `GET /api/universities`
- Interval: 30s
- Timeout: 10s
- Retries: 3

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gaza_uni_portal
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

Gaza Uni Portal Team

## 🙏 Acknowledgments

- Built as part of university coursework on Docker and Git workflows
- Inspired by the need to help students in Gaza access higher education information
