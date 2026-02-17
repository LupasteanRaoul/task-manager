# TaskFlow - Manager de Sarcini

> Aplicatie full-stack pentru gestionarea sarcinilor, construita cu React, FastAPI (Python) si MongoDB.

## Descriere

TaskFlow este o platforma unde poti organiza, prioritiza si finaliza sarcinile echipei tale intr-un singur loc.

### Functionalitati

- **Dashboard interactiv** - statistici in timp real, grafice (status, prioritati, productivitate)
- **Gestiune sarcini** - CRUD complet cu filtrare, cautare, prioritati si deadline-uri
- **Kanban Board** - vizualizare drag & drop cu 3 coloane (De Facut, In Lucru, Finalizat)
- **Categorii** - organizare sarcini pe categorii cu culori
- **Autentificare** - login/register cu token
- **Dark/Light Mode** - comutare intre teme
- **Responsive design** - sidebar colapsabil, layout adaptat mobile

---

## Tehnologii

### Frontend
- **React 19** - UI modern cu hooks si context
- **Tailwind CSS 3.4** - stilizare utility-first
- **shadcn/ui + Radix** - componente accesibile
- **Recharts 3** - vizualizare date (PieChart, BarChart)
- **Lucide React** - iconuri SVG
- **React Router 7** - navigare SPA

### Backend
- **FastAPI** - framework Python ASGI
- **Motor** - driver async MongoDB
- **Pydantic** - validare date

### Baza de date
- **MongoDB** - baza de date NoSQL

---

## Instalare si configurare

### Cerinte
- **Node.js** 16+ (recomandat 18+)
- **Python** 3.9+ (recomandat 3.11+)
- **MongoDB** 6.0+ (local sau MongoDB Atlas)

### 1. Cloneaza repository-ul

```bash
git clone https://github.com/LupasteanRaoul/task-manager.git
cd task-manager
```

### 2. Configurare Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # pe macOS/Linux

pip install -r requirements.txt
cp .env.example .env
# Editeaza .env cu URI-ul MongoDB

uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Configurare Frontend

```bash
cd frontend
cp .env.example .env
# Editeaza .env cu URL-ul backend-ului (ex: http://localhost:8001)
yarn install
yarn start
```

### 4. Seed date demo

```bash
curl -X POST http://localhost:8001/api/seed
```

---

## Credentiale demo

| Email | Parola | Rol |
|-------|--------|-----|
| alex@taskflow.io | demo123 | Admin |
| maria@taskflow.io | demo123 | Member |

---

## Structura proiectului

```
task-manager/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   └── Layout.jsx       # sidebar + header
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # autentificare
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Kanban.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Login.jsx
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env.example
├── DEPLOY.md
└── README.md
```

---

## Deploy

Vezi sectiunea [DEPLOY.md](./DEPLOY.md) pentru instructiuni detaliate.

---

## Licenta

MIT License 2025
