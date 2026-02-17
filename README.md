Iată un fișier `README.md` complet și bine structurat, pe baza informațiilor tale. Este gata de copiat și folosit în repository-ul GitHub.

```markdown
# 🚀 TaskFlow - Manager de Sarcini Modern

**TaskFlow** este o aplicație web modernă pentru gestionarea eficientă a task-urilor, construită cu tehnologii de ultimă generație. Oferă o experiență fluidă atât pentru utilizatori individuali, cât și pentru echipe mici.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)

---

## 🔗 Link-uri Live

| Componentă        | URL                                                                 | Status      |
|-------------------|---------------------------------------------------------------------|-------------|
| 🌐 Frontend       | [task-manager-gamma-taupe-32.vercel.app](https://task-manager-gamma-taupe-32.vercel.app) | ✅ Live     |
| ⚡ Backend API    | [task-manager-api-thps.onrender.com](https://task-manager-api-thps.onrender.com)         | ✅ Live     |
| 📊 Health Check   | [task-manager-api-thps.onrender.com/api/health](https://task-manager-api-thps.onrender.com/api/health) | ✅ Live |
| 🗄️ Database       | MongoDB Atlas                                                                              | ✅ Connected |

---

## ✨ Funcționalități

### 📋 Gestionare Task-uri
- ✅ Creare, editare și ștergere task-uri
- ✅ Filtrare după status, prioritate și categorie
- ✅ Drag & drop pentru schimbarea statusului (Kanban)
- ✅ Setare deadline și prioritate

### 👤 Autentificare
- ✅ Înregistrare utilizatori noi
- ✅ Login securizat
- ✅ Session management (JWT)

### 📊 Dashboard
- ✅ Statistici în timp real
- ✅ Grafice interactive (Recharts)
- ✅ Breakdown pe status, prioritate și categorie
- ✅ Listă task-uri recente

### 🎨 Design
- ✅ UI modern cu Tailwind CSS
- ✅ Componente Radix UI (accesibile și personalizabile)
- ✅ Responsive design (mobile-first)
- ✅ Dark mode pregătit

---

## 🛠️ Tech Stack

### Frontend
```
├── React 19
├── TypeScript
├── Tailwind CSS
├── Radix UI Components
├── React Router DOM v7
├── Axios (HTTP Client)
├── React Hook Form
├── Zod (Validation)
├── Recharts (Grafice)
└── Vercel (Deploy)
```

### Backend
```
├── FastAPI (Python)
├── Uvicorn (ASGI Server)
├── Motor (Async MongoDB)
├── Pydantic (Validation)
├── Python-dotenv
└── Render (Deploy)
```

### Database
```
└── MongoDB Atlas (M0 Free Tier)
```

---

## 📦 Instalare Locală

### Cerințe
- Node.js 20+
- Python 3.10+
- Cont MongoDB Atlas (cluster gratuit)

### 1. Clonează repository-ul
```bash
git clone https://github.com/LupasteanRaoul/task-manager.git
cd task-manager
```

### 2. Setup Frontend
```bash
cd frontend
yarn install   # sau npm install
yarn start     # sau npm start
```
Frontend-ul va rula pe `http://localhost:3000`

### 3. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
# venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```
Backend-ul va rula pe `http://localhost:8000`

### 4. Variabile de Mediu

**Frontend (`.env` în folderul `frontend`)**
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

**Backend (`.env` în folderul `backend`)**
```
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
DB_NAME=taskflow
SECRET_KEY=un_string_random_foarte_lung
CORS_ORIGINS=http://localhost:3000
```

---

## 📡 API Endpoints

| Metodă | Endpoint                 | Descriere                     |
|--------|--------------------------|-------------------------------|
| GET    | `/api/health`            | Health check                  |
| POST   | `/api/auth/register`     | Înregistrare utilizator       |
| POST   | `/api/auth/login`        | Login utilizator              |
| GET    | `/api/tasks`             | Listă task-uri                |
| POST   | `/api/tasks`             | Creare task nou               |
| PUT    | `/api/tasks/{id}`        | Update task                   |
| DELETE | `/api/tasks/{id}`        | Ștergere task                 |
| GET    | `/api/categories`        | Listă categorii               |
| POST   | `/api/categories`        | Creare categorie              |
| DELETE | `/api/categories/{id}`   | Ștergere categorie            |
| GET    | `/api/dashboard/stats`   | Statistici dashboard          |
| POST   | `/api/seed`              | Seed date demo                |

Documentație interactivă disponibilă la `/docs` (Swagger UI) după pornirea backend-ului.

---

## 📸 Screenshots

| Pagina de Login | Dashboard |
|-----------------|-----------|
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) |

---

## 🚀 Deploy

### Frontend (Vercel)
1. Conectează repository-ul la Vercel.
2. Setează **Root Directory** = `frontend`.
3. Adaugă variabila de mediu `REACT_APP_BACKEND_URL` cu URL-ul backend-ului.
4. Activează auto-deploy pentru fiecare push pe branch-ul principal.

### Backend (Render)
1. Conectează repository-ul la Render.
2. Creează un **Web Service** cu:
   - **Root Directory** = `backend`
   - **Build Command** = `pip install -r requirements.txt`
   - **Start Command** = `uvicorn server:app --host 0.0.0.0 --port $PORT`
3. Adaugă variabilele de mediu: `MONGO_URL`, `DB_NAME`, `SECRET_KEY`, `CORS_ORIGINS`.
4. Activează auto-deploy.

### Database (MongoDB Atlas)
- Creează un cluster gratuit (M0).
- Configurează **Network Access** = `0.0.0.0/0` (allow from anywhere).
- Creează un user de bază de date.
- Copiază connection string-ul și folosește-l în `MONGO_URL`.

---

## 📁 Structura Proiectului

```
task-manager/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # componente shadcn/Radix
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Kanban.jsx
│   │   │   └── Settings.jsx
│   │   ├── context/             # AuthContext, etc.
│   │   ├── hooks/                # hook-uri personalizate
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── server.py                 # aplicația FastAPI
│   ├── requirements.txt
│   ├── .env.example
│   └── runtime.txt                # specifică Python 3.11
├── README.md
└── DEPLOY.md
```

---

## 🔒 Securitate
- ✅ CORS configurat corect (doar domeniile permise).
- ✅ Environment variables pentru date sensibile.
- ✅ Autentificare MongoDB cu user și parolă.
- ✅ Input validation cu Pydantic (backend) și Zod (frontend).
- ✅ Parole criptate cu bcrypt.
- ⚠️ **Notă:** În producție, este implementată autentificare JWT pentru securitate maximă.

---

## 🤝 Contribuție
Contribuțiile sunt binevenite! Urmează pașii:
1. Fork proiectul.
2. Creează un branch nou (`git checkout -b feature/nume-feature`).
3. Commite modificările (`git commit -m 'Adaugă o nouă funcționalitate'`).
4. Fă push pe branch (`git push origin feature/nume-feature`).
5. Deschide un Pull Request.

---

## 📄 Licență
Acest proiect este open-source și disponibil sub licența **MIT**.

---

## 👨‍💻 Autor
**Raoul Lupastean**  
- GitHub: [@LupasteanRaoul](https://github.com/LupasteanRaoul)
- Proiect: [TaskFlow](https://github.com/LupasteanRaoul/task-manager)

---

## 🙏 Mulțumiri
- [Vercel](https://vercel.com) pentru hosting frontend
- [Render](https://render.com) pentru hosting backend
- [MongoDB Atlas](https://www.mongodb.com/atlas) pentru baza de date gratuită
- [Radix UI](https://www.radix-ui.com/) pentru componentele accesibile
- [Tailwind CSS](https://tailwindcss.com/) pentru sistemul de styling
- [shadcn/ui](https://ui.shadcn.com/) pentru componentele frumoase

---

<div align="center">
  Construit cu ❤️ folosind React + FastAPI + MongoDB
  <br />
  <a href="#">⬆ Back to Top</a>
</div>