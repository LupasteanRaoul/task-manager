import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Search, Plus, X, ListTodo, Calendar, Trash2, Edit3,
  CheckCircle2, Clock, AlertTriangle, Loader2, ChevronDown
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const statusConfig = {
  todo: { label: "De Facut", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", icon: ListTodo },
  in_progress: { label: "In Lucru", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  done: { label: "Finalizat", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
};

const priorityConfig = {
  low: { label: "Scazuta", color: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  medium: { label: "Medie", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  high: { label: "Ridicata", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  urgent: { label: "Urgenta", color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", status: "todo", priority: "medium", category: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, catsRes] = await Promise.all([
        axios.get(`${API}/tasks`),
        axios.get(`${API}/categories`)
      ]);
      setTasks(tasksRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: "", description: "", status: "todo", priority: "medium", category: "", dueDate: "" });
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      category: task.category || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null };
      if (editingTask) {
        await axios.put(`${API}/tasks/${editingTask.id}`, payload);
      } else {
        await axios.post(`${API}/tasks`, payload);
      }
      await fetchData();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Esti sigur ca vrei sa stergi aceasta sarcina?")) return;
    try {
      await axios.delete(`${API}/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await axios.put(`${API}/tasks/${task.id}`, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Sarcini</h1>
          <p className="text-sm text-muted-foreground mt-1">{tasks.length} sarcini in total</p>
        </div>
        <Button data-testid="create-task-btn" onClick={openCreate} className="h-9 text-sm bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground">
          <Plus className="w-4 h-4 mr-1.5" /> Sarcina noua
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="search-tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cauta dupa titlu sau descriere..."
              className="pl-9 h-9"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-accent rounded-lg p-1">
            {["all", "todo", "in_progress", "done"].map(s => (
              <button
                key={s}
                data-testid={`filter-status-${s}`}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
                  statusFilter === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "Toate" : statusConfig[s]?.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-accent rounded-lg p-1">
            {["all", "low", "medium", "high", "urgent"].map(p => (
              <button
                key={p}
                data-testid={`filter-priority-${p}`}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
                  priorityFilter === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "all" ? "Toate" : priorityConfig[p]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.map(task => {
          const st = statusConfig[task.status] || statusConfig.todo;
          const pr = priorityConfig[task.priority] || priorityConfig.medium;
          const StIcon = st.icon;
          return (
            <div key={task.id} data-testid={`task-item-${task.id}`} className="bg-card rounded-lg border border-border p-4 hover:shadow-sm transition-shadow duration-150 group">
              <div className="flex items-start gap-4">
                <button
                  data-testid={`task-toggle-${task.id}`}
                  onClick={() => handleStatusChange(task, task.status === "done" ? "todo" : task.status === "todo" ? "in_progress" : "done")}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-150 ${
                    task.status === "done" ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/30 hover:border-[hsl(var(--primary))]"
                  }`}
                >
                  {task.status === "done" && <CheckCircle2 className="w-3 h-3" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm font-semibold ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pr.color}`}>{pr.label}</span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {task.category && (
                      <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded">{task.category}</span>
                    )}
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString("ro-RO", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button data-testid={`edit-task-${task.id}`} onClick={() => openEdit(task)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors duration-150">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button data-testid={`delete-task-${task.id}`} onClick={() => handleDelete(task.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors duration-150">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ListTodo className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nicio sarcina gasita</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Creeaza prima ta sarcina sau modifica filtrele</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div data-testid="task-form-modal" className="bg-card border border-border rounded-xl w-full max-w-lg p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {editingTask ? "Editeaza Sarcina" : "Sarcina Noua"}
              </h2>
              <button data-testid="close-form" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Titlu</Label>
                <Input data-testid="task-title-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ce trebuie facut?" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Descriere</Label>
                <textarea
                  data-testid="task-desc-input"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Detalii suplimentare..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    data-testid="task-status-select"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="todo">De Facut</option>
                    <option value="in_progress">In Lucru</option>
                    <option value="done">Finalizat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Prioritate</Label>
                  <select
                    data-testid="task-priority-select"
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="low">Scazuta</option>
                    <option value="medium">Medie</option>
                    <option value="high">Ridicata</option>
                    <option value="urgent">Urgenta</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categorie</Label>
                  <select
                    data-testid="task-category-select"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Fara categorie</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Termen Limita</Label>
                  <Input data-testid="task-duedate-input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="h-10" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button data-testid="cancel-form" variant="outline" onClick={() => setShowForm(false)} className="h-9">Anuleaza</Button>
              <Button
                data-testid="save-task-btn"
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="h-9 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingTask ? "Salveaza" : "Creeaza")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
