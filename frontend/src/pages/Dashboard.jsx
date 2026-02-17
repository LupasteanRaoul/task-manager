import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ListTodo, CheckCircle2, Clock, AlertTriangle,
  ArrowRight, TrendingUp, Loader2
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_COLORS = ["#94a3b8", "#3b82f6", "#10b981"];
const PRIORITY_COLORS = ["#94a3b8", "#f59e0b", "#ef4444", "#dc2626"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/dashboard/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-muted-foreground py-20">Nu s-au putut incarca datele</div>;
  }

  const completion = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const statCards = [
    { label: "Total Sarcini", value: stats.total, icon: ListTodo, color: "text-[hsl(var(--primary))]", bg: "bg-[hsl(var(--primary)/0.1)]" },
    { label: "Finalizate", value: stats.done, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "In Lucru", value: stats.inProgress, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "De Facut", value: stats.todo, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Panou de Control</h1>
        <p className="text-sm text-muted-foreground mt-1">Vizualizare generala a sarcinilor tale</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} data-testid={`stat-card-${i}`} className="bg-card rounded-lg border border-border p-5 hover:shadow-sm transition-shadow duration-150">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>Productivitate</h3>
          <p className="text-xs text-muted-foreground mb-4">Rata de finalizare</p>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${completion * 2.51} ${251.2 - completion * 2.51}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>{completion}%</span>
                <span className="text-xs text-muted-foreground">finalizat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>Distributie Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Task-uri pe status</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={stats.statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {stats.statusBreakdown.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center">
            {stats.statusBreakdown.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[i] }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>Prioritati</h3>
          <p className="text-xs text-muted-foreground mb-4">Distributie pe prioritate</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.priorityBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                {stats.priorityBreakdown.map((_, i) => (
                  <Cell key={i} fill={PRIORITY_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent tasks + categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Sarcini Recente</h3>
            <button
              data-testid="view-all-tasks-btn"
              onClick={() => navigate("/tasks")}
              className="text-xs text-[hsl(var(--primary))] font-medium hover:underline flex items-center gap-1"
            >
              Vezi toate <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentTasks.map(task => (
              <div key={task.id} data-testid={`recent-task-${task.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-150">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  task.status === "done" ? "bg-emerald-500" : task.status === "in_progress" ? "bg-blue-500" : "bg-slate-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.category || "Fara categorie"}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  task.priority === "urgent" ? "bg-rose-500/10 text-rose-500" :
                  task.priority === "high" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                  task.priority === "medium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                  "bg-slate-500/10 text-slate-500"
                }`}>
                  {task.priority === "urgent" ? "Urgent" : task.priority === "high" ? "Ridicat" : task.priority === "medium" ? "Mediu" : "Scazut"}
                </span>
              </div>
            ))}
            {stats.recentTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nicio sarcina inca</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Categorii Active</h3>
            <button
              data-testid="view-categories-btn"
              onClick={() => navigate("/categories")}
              className="text-xs text-[hsl(var(--primary))] font-medium hover:underline flex items-center gap-1"
            >
              Gestioneaza <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
                <span className="text-xs font-semibold text-muted-foreground bg-accent px-2.5 py-1 rounded-full">
                  {cat.count} {cat.count === 1 ? "sarcina" : "sarcini"}
                </span>
              </div>
            ))}
            {stats.categoryBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nicio categorie inca</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
