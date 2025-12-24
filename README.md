

# 🎓 Gaza Universities Majors System

A professional, full-stack web application designed to help students explore academic opportunities in Gaza. It features an advanced search engine, a visual university directory, and a secure administration panel with a student consultation tracking system.

## ✨ Key Features

### User Experience

* **📚 Browse Universities**: Explore detailed profiles, colleges, and specific majors.
* **🔍 Advanced Search & Filters**: Search by name or category (Engineering, Medical, IT, etc.) and filter by Public/Private status.
* **💡 Consultation System**: Students can submit their GPA and preferences to receive academic guidance.
* **🆕 Request Tracking**: Unique Request IDs allow students to track the status of their consultation and view admin responses.
* **🌓 Modern UI**: Responsive design featuring Glassmorphism/Neomorphism styles with Dark Mode support.

### Administration

* **🔐 Secure Management**: Protected dashboard to manage the entire database.
* **➕ Content Control**: Add, edit, or delete universities, images, and academic fields.
* **📊 Response System**: View student requests and provide/edit tailored advice.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Context API.
* **Backend**: Node.js, Express 5, TypeScript, MongoDB (Mongoose).
* **DevOps**: Docker (Multi-stage builds), Nginx.

---

## 🚀 Setup & Installation

### Prerequisites

* **Node.js**: v18 or higher.
* **MongoDB**: An active Atlas cluster (recommended) or local instance.
* **Docker**: Docker Desktop installed and running.

### 1. Environment Configuration

Create a `.env` file in the **root directory** of the project (`Project University Help/`):

```env
# Backend Config
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/gaza_uni_portal

# Frontend Config (For Docker Build)
VITE_API_URL=http://localhost:5000/api

```

---

### 2. Running Locally (Development Mode)

```bash
# Setup Backend
cd src/backend
npm install
npm run dev

# Setup Frontend (Open new terminal)
cd src/frontend
npm install
npm run dev

```

---

### 3. Running with Docker (Production Mode)

#### **Option A: Automated Setup (Recommended)**

This is the simplest way to get the entire system running in sync.

```bash
docker-compose up --build -d

```

#### **Option B: Manual Build & Run**

If you prefer manual control over each container and network:

**1. Create a dedicated network:**

```bash
docker network create gaza-net

```

**2. Build the Images:**

```bash
# Build Backend
docker build --target backend-production -t university-backend .

# Build Frontend (Injecting API URL)
docker build --target frontend-production --build-arg VITE_API_URL=http://localhost:5000/api -t university-frontend .

```

**3. Run the Containers:**

```bash
# Run Backend (Named 'backend' for Nginx discovery)
docker run -d --name backend --network gaza-net --env-file .env -p 5000:5000 university-backend

# Run Frontend
docker run -d --name frontend --network gaza-net -p 80:80 university-frontend

```

---

## 🔧 Troubleshooting & Technical Notes

During development, several critical issues were resolved to ensure stability:

* **DNS Resolution**: Fixed MongoDB Atlas connection failures in Node.js by prioritizing IPv4 (`dns.setDefaultResultOrder('ipv4first')`).
* **TypeScript Strictness**: Resolved `tsc` build blockers using `--skipLibCheck` and converting to `import type` syntax for React types.
* **Dependency Management**: Fixed missing `bcryptjs` modules in production by moving them to core dependencies and ensuring type definitions were installed.
* **Networking**: Resolved Nginx `host not found` errors by ensuring containers share a bridge network and the backend is correctly named.

---

## 📖 API Documentation Highlights

* `GET /api/universities`: Retrieve all university data.
* `POST /api/consultations`: Student submission portal.
* `GET /api/consultations/:requestId`: Public tracking endpoint.

---

**Made with 🎓Mohammed Anwar Abu Lehia for the students of Gaza.**
