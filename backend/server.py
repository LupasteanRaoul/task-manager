from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="TaskFlow API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# ============================================================
# ✅ CORS MIDDLEWARE - ÎNAINTE DE ROUTERS (FĂRĂ SPAȚII!)
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://task-manager-gamma-taupe-32.vercel.app",
        "http://localhost:3000",
        "https://task-manager-api-thps.onrender.com",  # ✅ URL-ul CORECT din logs
        "*",  # Permite orice pentru development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Models
# ============================================================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TaskCreate(BaseModel):
    title: str
    description: str = ""
    status: str = "todo"
    priority: str = "medium"
    category: str = ""
    dueDate: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    dueDate: Optional[str] = None

class CategoryCreate(BaseModel):
    name: str
    color: str = "#818CF8"

# ============================================================
# Auth Routes
# ============================================================

@api_router.get("/")
async def root():
    return {"message": "TaskFlow API v1.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

@api_router.post("/auth/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email-ul este deja inregistrat")
    user_dict = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "role": "member",
        "avatar": "".join([n[0] for n in user.name.split() if n]).upper()[:2],
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_dict)
    safe = {k: v for k, v in user_dict.items() if k not in ("password", "_id")}
    return {"success": True, "user": safe, "token": f"token_{user_dict['id']}"}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or user.get("password") != credentials.password:
        raise HTTPException(status_code=401, detail="Email sau parola incorecta")
    safe = {k: v for k, v in user.items() if k not in ("password",)}
    return {"success": True, "user": safe, "token": f"token_{user['id']}"}

# ============================================================
# Tasks Routes
# ============================================================

@api_router.get("/tasks")
async def get_tasks(status: Optional[str] = None, priority: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority
    if category:
        query["category"] = category
    tasks = await db.tasks.find(query, {"_id": 0}).sort("createdAt", -1).to_list(500)
    return tasks

@api_router.post("/tasks", status_code=201)
async def create_task(task: TaskCreate):
    task_dict = {
        "id": str(uuid.uuid4()),
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "category": task.category,
        "dueDate": task.dueDate,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    }
    await db.tasks.insert_one(task_dict)
    return {k: v for k, v in task_dict.items() if k != "_id"}

@api_router.put("/tasks/{task_id}")
async def update_task(task_id: str, task: TaskUpdate):
    update_data = {k: v for k, v in task.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nicio modificare")
    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.tasks.update_one({"id": task_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task negasit")
    updated = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    return updated

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    result = await db.tasks.delete_one({"id": task_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task negasit")
    return {"success": True}

# ============================================================
# Categories Routes
# ============================================================

@api_router.get("/categories")
async def get_categories():
    cats = await db.categories.find({}, {"_id": 0}).to_list(100)
    return cats

@api_router.post("/categories", status_code=201)
async def create_category(cat: CategoryCreate):
    existing = await db.categories.find_one({"name": cat.name}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Categoria exista deja")
    cat_dict = {
        "id": str(uuid.uuid4()),
        "name": cat.name,
        "color": cat.color,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await db.categories.insert_one(cat_dict)
    return {k: v for k, v in cat_dict.items() if k != "_id"}

@api_router.delete("/categories/{cat_id}")
async def delete_category(cat_id: str):
    result = await db.categories.delete_one({"id": cat_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categoria negasita")
    return {"success": True}

# ============================================================
# Dashboard Stats
# ============================================================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    total = await db.tasks.count_documents({})
    todo = await db.tasks.count_documents({"status": "todo"})
    in_progress = await db.tasks.count_documents({"status": "in_progress"})
    done = await db.tasks.count_documents({"status": "done"})
    urgent = await db.tasks.count_documents({"priority": "urgent"})
    high = await db.tasks.count_documents({"priority": "high"})

    now_iso = datetime.now(timezone.utc).isoformat()
    overdue = await db.tasks.count_documents({
        "dueDate": {"$lt": now_iso, "$ne": None, "$ne": ""},
        "status": {"$ne": "done"}
    })

    low = await db.tasks.count_documents({"priority": "low"})
    medium = await db.tasks.count_documents({"priority": "medium"})

    pipeline = [
        {"$match": {"category": {"$ne": ""}}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    cat_stats = await db.tasks.aggregate(pipeline).to_list(20)

    recent = await db.tasks.find({}, {"_id": 0}).sort("createdAt", -1).to_list(5)

    return {
        "total": total,
        "todo": todo,
        "inProgress": in_progress,
        "done": done,
        "overdue": overdue,
        "urgent": urgent,
        "high": high,
        "priorityBreakdown": [
            {"name": "Scazuta", "value": low},
            {"name": "Medie", "value": medium},
            {"name": "Ridicata", "value": high},
            {"name": "Urgenta", "value": urgent}
        ],
        "statusBreakdown": [
            {"name": "De Facut", "value": todo},
            {"name": "In Lucru", "value": in_progress},
            {"name": "Finalizat", "value": done}
        ],
        "categoryBreakdown": [{"name": s["_id"], "count": s["count"]} for s in cat_stats],
        "recentTasks": recent
    }

# ============================================================
# Seed Data
# ============================================================

@api_router.post("/seed")
async def seed_data():
    existing = await db.users.count_documents({})
    if existing > 0:
        return {"message": "Date deja existente"}

    users = [
        {"id": "u1", "name": "Alexandru Popescu", "email": "alex@taskflow.io", "password": "demo123", "role": "admin", "avatar": "AP", "createdAt": "2025-01-15T10:00:00Z"},
        {"id": "u2", "name": "Maria Ionescu", "email": "maria@taskflow.io", "password": "demo123", "role": "member", "avatar": "MI", "createdAt": "2025-02-01T10:00:00Z"},
    ]
    await db.users.insert_many(users)

    categories = [
        {"id": "c1", "name": "Dezvoltare", "color": "#818CF8", "createdAt": "2025-01-15T10:00:00Z"},
        {"id": "c2", "name": "Design", "color": "#F472B6", "createdAt": "2025-01-15T10:00:00Z"},
        {"id": "c3", "name": "Marketing", "color": "#34D399", "createdAt": "2025-01-15T10:00:00Z"},
        {"id": "c4", "name": "Bug Fix", "color": "#F87171", "createdAt": "2025-01-15T10:00:00Z"},
        {"id": "c5", "name": "Documentatie", "color": "#FBBF24", "createdAt": "2025-01-15T10:00:00Z"},
    ]
    await db.categories.insert_many(categories)

    tasks = [
        {"id": "t1", "title": "Redesign pagina de login", "description": "Actualizare UI pentru pagina de autentificare cu noul design system", "status": "done", "priority": "high", "category": "Design", "dueDate": "2025-12-20T23:59:00Z", "createdAt": "2025-12-01T10:00:00Z", "updatedAt": "2025-12-18T15:30:00Z"},
        {"id": "t2", "title": "Implementare API task-uri", "description": "CRUD complet pentru gestionarea task-urilor cu FastAPI si MongoDB", "status": "done", "priority": "urgent", "category": "Dezvoltare", "dueDate": "2025-12-25T23:59:00Z", "createdAt": "2025-12-05T09:00:00Z", "updatedAt": "2025-12-22T14:00:00Z"},
        {"id": "t3", "title": "Campanie social media Q1", "description": "Planificare si executare campanie pe LinkedIn si Twitter pentru Q1 2026", "status": "in_progress", "priority": "medium", "category": "Marketing", "dueDate": "2026-01-31T23:59:00Z", "createdAt": "2025-12-10T11:00:00Z", "updatedAt": "2025-12-28T10:00:00Z"},
        {"id": "t4", "title": "Fix bug notificari email", "description": "Notificarile email nu se trimit corect cand un task este marcat ca urgent", "status": "todo", "priority": "high", "category": "Bug Fix", "dueDate": "2026-01-10T23:59:00Z", "createdAt": "2025-12-15T08:00:00Z", "updatedAt": "2025-12-15T08:00:00Z"},
        {"id": "t5", "title": "Documentare API endpoints", "description": "Creare documentatie completa pentru toate endpoint-urile API cu exemple", "status": "todo", "priority": "low", "category": "Documentatie", "dueDate": "2026-02-01T23:59:00Z", "createdAt": "2025-12-18T14:00:00Z", "updatedAt": "2025-12-18T14:00:00Z"},
        {"id": "t6", "title": "Optimizare performanta dashboard", "description": "Reducere timp de incarcare al dashboard-ului sub 2 secunde", "status": "in_progress", "priority": "medium", "category": "Dezvoltare", "dueDate": "2026-01-15T23:59:00Z", "createdAt": "2025-12-20T09:30:00Z", "updatedAt": "2026-01-02T11:00:00Z"},
        {"id": "t7", "title": "Implementare dark mode", "description": "Adaugare suport complet pentru tema dark in toata aplicatia", "status": "done", "priority": "medium", "category": "Design", "dueDate": "2025-12-30T23:59:00Z", "createdAt": "2025-12-08T10:00:00Z", "updatedAt": "2025-12-28T16:00:00Z"},
        {"id": "t8", "title": "Setup CI/CD pipeline", "description": "Configurare GitHub Actions pentru build si deploy automat", "status": "todo", "priority": "urgent", "category": "Dezvoltare", "dueDate": "2026-01-05T23:59:00Z", "createdAt": "2025-12-22T13:00:00Z", "updatedAt": "2025-12-22T13:00:00Z"},
        {"id": "t9", "title": "Testare responsive design", "description": "Verificare ca toate paginile functioneaza corect pe mobile si tablet", "status": "todo", "priority": "medium", "category": "Design", "dueDate": "2026-01-20T23:59:00Z", "createdAt": "2025-12-25T10:00:00Z", "updatedAt": "2025-12-25T10:00:00Z"},
        {"id": "t10", "title": "Integrare analytics", "description": "Adaugare Google Analytics si event tracking pentru toate actiunile principale", "status": "in_progress", "priority": "low", "category": "Marketing", "dueDate": "2026-01-25T23:59:00Z", "createdAt": "2025-12-28T09:00:00Z", "updatedAt": "2026-01-03T10:00:00Z"},
    ]
    await db.tasks.insert_many(tasks)

    return {"message": "Date seed create cu succes", "tasks": len(tasks), "categories": len(categories), "users": len(users)}

# ============================================================
# Include Router
# ============================================================

app.include_router(api_router)

# ============================================================
# Logging & Shutdown
# ============================================================

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()