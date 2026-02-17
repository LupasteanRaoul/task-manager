<div align="center">

# 🚀 TaskFlow
### Enterprise-Ready Full-Stack Task Management Platform

Production-grade task management application built with modern technologies and deployed to the cloud.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)

</div>

---

# 🧠 Executive Summary

**TaskFlow** is a scalable, cloud-deployed full-stack productivity platform designed to demonstrate modern software engineering practices.

It showcases:

- Clean architecture
- Secure authentication (JWT)
- RESTful API design
- Cloud deployment strategy
- Component-based frontend architecture
- Production configuration management
- Real-world environment handling

This project reflects real production patterns rather than tutorial-level implementation.

---

# 🌍 Live Infrastructure

| Layer | Deployment |
|-------|------------|
| 🌐 Frontend | Vercel (Edge CDN) |
| ⚡ Backend API | Render (Python Web Service) |
| 🗄 Database | MongoDB Atlas (Cloud M0) |
| 📚 API Docs | Swagger (FastAPI built-in) |

Frontend:  
https://task-manager-gamma-taupe-32.vercel.app

Backend Health:  
https://task-manager-api-thps.onrender.com/api/health

Swagger Documentation:  
https://task-manager-api-thps.onrender.com/docs

---

# ✨ Core Features

## 📋 Advanced Task Management
- Full CRUD operations
- Kanban board with drag & drop
- Deadline & priority system
- Category segmentation
- Real-time dashboard statistics

## 🔐 Secure Authentication & Authorization
- JWT-based stateless authentication
- Password hashing with bcrypt
- Protected API routes
- Role-ready structure
- Secure environment variables

## 📊 Data Analytics
- Interactive visualizations (Recharts)
- Status & priority distribution
- Completion metrics
- Activity overview dashboard

## 🎨 Modern UI/UX System
- Tailwind CSS utility system
- Radix UI accessible components
- Mobile-first responsive layout
- Component-based design architecture
- Dark mode ready

---

# 🏗 System Architecture

```
          ┌──────────────┐
          │   React SPA  │
          │  (Frontend)  │
          └───────┬──────┘
                  │ HTTPS
                  ▼
          ┌──────────────┐
          │   FastAPI    │
          │   REST API   │
          └───────┬──────┘
                  │ Async Motor
                  ▼
          ┌──────────────┐
          │  MongoDB     │
          │  Atlas Cloud │
          └──────────────┘
```

### Architectural Principles

- Separation of concerns
- Stateless backend
- Async I/O for scalability
- Environment-driven configuration
- Modular component design
- Cloud-native deployment

---

# 🛠 Technology Stack

## Frontend
- React 18
- TypeScript
- React Router
- Tailwind CSS
- Radix UI
- Axios
- React Hook Form
- Zod validation
- Recharts

## Backend
- FastAPI
- Uvicorn
- Motor (async MongoDB driver)
- Pydantic validation
- Python-dotenv
- JWT authentication

## Database
- MongoDB Atlas (Cloud-hosted NoSQL)

---

# 📁 Project Structure

```
task-manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── .env.example
│   └── runtime.txt
│
├── README.md
└── DEPLOY.md
```

---

# 🔐 Security & Production Considerations

- JWT authentication
- Password hashing (bcrypt)
- Backend request validation (Pydantic)
- Frontend schema validation (Zod)
- CORS restricted to allowed domains
- Secrets managed via environment variables
- No hardcoded credentials
- Cloud-based database authentication

---

# ⚙️ Local Development

## Requirements
- Node.js 20+
- Python 3.10+
- MongoDB Atlas account

---

## Clone Repository

```bash
git clone https://github.com/LupasteanRaoul/task-manager.git
cd task-manager
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs on:
http://localhost:3000

---

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

Runs on:
http://localhost:8000

Swagger:
http://localhost:8000/docs

---

# 🌐 Environment Configuration

## Frontend (.env)

```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Backend (.env)

```
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DB_NAME=taskflow
SECRET_KEY=super_random_long_secret_key
CORS_ORIGINS=http://localhost:3000
```

---

# 🚀 Deployment Strategy

## Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Edge CDN deployment
- Automatic CI on push

## Backend (Render)
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command:
```
uvicorn server:app --host 0.0.0.0 --port $PORT
```
- Auto deploy on main branch

## Database (MongoDB Atlas)
- M0 free cluster
- Network Access: restricted or 0.0.0.0/0
- Authenticated user access

---

# 📈 Engineering Highlights

- Async backend architecture
- Stateless JWT authentication
- Clean component separation
- Production-ready deployment
- Real cloud infrastructure
- Secure configuration handling
- Structured REST API design
- Responsive modern UI system

---

# 🎯 What This Project Demonstrates

- Full-stack development capability
- Backend API architecture
- Authentication systems
- Cloud deployment strategy
- Clean project organization
- Professional documentation
- Real-world scalability patterns

---

# 👨‍💻 Author

**Raoul Lupastean**

GitHub:  
https://github.com/LupasteanRaoul

---

# 📄 License

MIT License

---

<div align="center">

### Built with ❤️ using React + FastAPI + MongoDB

If you find this project valuable, consider giving it a ⭐

</div>
