# Ghid de Deploy - TaskFlow

## 1. Frontend pe Vercel (GRATUIT)

### Pasi:

1. **Mergi pe [vercel.com](https://vercel.com)** si creeaza cont cu GitHub

2. **Importa proiectul din GitHub**
   - Click "New Project" → Import Git Repository
   - Selecteaza repository-ul `task-manager`

3. **Configureaza build settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`

4. **Adauga variabila de mediu:**
   - `REACT_APP_BACKEND_URL` = URL-ul backend-ului (ex: `https://task-manager-api.onrender.com`)

5. **Click Deploy** – Vercel va construi si publica automat

---

## 2. Backend pe Render (GRATUIT)

### Pasi:

1. **Mergi pe [render.com](https://render.com)** si creeaza cont cu GitHub

2. **Creeaza un Web Service nou:**
   - Conecta la GitHub
   - Selecteaza repository-ul `task-manager`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **Configureaza variabilele de mediu:**
   - `MONGO_URL` = connection string-ul MongoDB Atlas
   - `DB_NAME` = `task_manager`
   - `CORS_ORIGINS` = URL-ul frontend-ului Vercel (ex: `https://task-manager-xyz.vercel.app`)

4. **Click Create Web Service**

---

## 3. Baza de date – MongoDB Atlas (GRATUIT)

1. **Mergi pe [mongodb.com/atlas](https://www.mongodb.com/atlas)** si creeaza cont

2. **Creeaza un cluster gratuit (M0):**
   - Provider: AWS
   - Regiune: Frankfurt (eu-central-1) - cel mai aproape de Romania

3. **Configureaza accesul:**
   - **Database Access:** creeaza un user cu parola
   - **Network Access:** adauga `0.0.0.0/0` (permite orice IP)

4. **Obtine connection string:**
   - Click "Connect" → "Connect your application"
   - Copiaza string-ul: `mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/task_manager`
   - Actualizeaza in variabila `MONGO_URL` a backend-ului

5. **Seed date demo:**
   - Dupa deploy, ruleaza: `curl -X POST https://BACKEND-URL/api/seed`

---

## 4. Ordinea de deploy

1. **MongoDB Atlas** - creeaza cluster-ul si obtine connection string
2. **Backend pe Render** - deploy backend cu MONGO_URL de la Atlas
3. **Frontend pe Vercel** - deploy frontend cu REACT_APP_BACKEND_URL de la Render
4. **Actualizeaza CORS** - in Render, seteaza CORS_ORIGINS la URL-ul Vercel

---

## 5. Costuri

| Serviciu | Plan | Cost |
|----------|------|------|
| Vercel | Hobby | Gratuit |
| Render | Free | Gratuit (spin-down dupa 15 min inactivitate) |
| MongoDB Atlas | M0 | Gratuit (512MB storage) |

**Total: 0 EUR!**
