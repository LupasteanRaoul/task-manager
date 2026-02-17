import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Plus, Trash2, Tag, Loader2, X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const presetColors = ["#818CF8", "#F472B6", "#34D399", "#F87171", "#FBBF24", "#60A5FA", "#A78BFA", "#FB923C"];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#818CF8");
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${API}/categories`, { name, color });
      await fetchCategories();
      setName("");
      setColor("#818CF8");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Eroare");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Esti sigur ca vrei sa stergi aceasta categorie?")) return;
    try {
      await axios.delete(`${API}/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Categorii</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestioneaza categoriile pentru sarcini</p>
        </div>
        <Button data-testid="create-category-btn" onClick={() => setShowForm(true)} className="h-9 text-sm bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground">
          <Plus className="w-4 h-4 mr-1.5" /> Categorie noua
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} data-testid={`category-item-${cat.id}`} className="bg-card rounded-lg border border-border p-5 hover:shadow-sm transition-shadow duration-150 group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + "20" }}>
                  <Tag className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Creata {new Date(cat.createdAt).toLocaleDateString("ro-RO")}
                  </p>
                </div>
              </div>
              <button
                data-testid={`delete-cat-${cat.id}`}
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-150"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <Tag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nicio categorie inca</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Creeaza prima ta categorie</p>
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div data-testid="category-form-modal" className="bg-card border border-border rounded-xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Categorie Noua</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nume</Label>
                <Input data-testid="category-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Dezvoltare, Marketing..." className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Culoare</Label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map(c => (
                    <button
                      key={c}
                      data-testid={`color-${c}`}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-lg transition-transform duration-150 ${color === c ? "ring-2 ring-offset-2 ring-offset-card ring-[hsl(var(--primary))] scale-110" : "hover:scale-105"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)} className="h-9">Anuleaza</Button>
              <Button
                data-testid="save-category-btn"
                onClick={handleCreate}
                disabled={saving || !name.trim()}
                className="h-9 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Creeaza"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
