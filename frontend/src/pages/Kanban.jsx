import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Plus, Loader2, Calendar, GripVertical, CheckCircle2, Clock, ListTodo } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const columns = [
  { id: "todo", label: "De Facut", icon: ListTodo, color: "border-t-slate-400", headerColor: "text-slate-500 dark:text-slate-400" },
  { id: "in_progress", label: "In Lucru", icon: Clock, color: "border-t-blue-500", headerColor: "text-blue-500" },
  { id: "done", label: "Finalizat", icon: CheckCircle2, color: "border-t-emerald-500", headerColor: "text-emerald-500" },
];

const priorityColors = {
  low: "bg-slate-400",
  medium: "bg-blue-500",
  high: "bg-amber-500",
  urgent: "bg-rose-500",
};

const priorityLabels = {
  low: "Scazuta",
  medium: "Medie",
  high: "Ridicata",
  urgent: "Urgenta",
};

export default function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }
    try {
      await axios.put(`${API}/tasks/${draggedTask.id}`, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === draggedTask.id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
    setDraggedTask(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Kanban</h1>
          <p className="text-sm text-muted-foreground mt-1">Trage si muta sarcinile intre coloane</p>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 14rem)" }} data-testid="kanban-board">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const ColIcon = col.icon;
          return (
            <div
              key={col.id}
              data-testid={`kanban-col-${col.id}`}
              className={`min-w-[300px] w-[340px] bg-accent/30 rounded-lg border border-border/50 border-t-2 ${col.color} flex flex-col shrink-0`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ColIcon className={`w-4 h-4 ${col.headerColor}`} />
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex-1 p-3 pt-0 space-y-3 overflow-y-auto">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    data-testid={`kanban-card-${task.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className={`bg-card rounded-lg border border-border p-4 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow duration-150 ${
                      draggedTask?.id === task.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                            <span className="text-xs text-muted-foreground">{priorityLabels[task.priority]}</span>
                          </div>
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
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground/40">
                    <p className="text-sm">Nicio sarcina</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
