import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { User, Bell, Shield, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notificari", icon: Bell },
    { id: "security", label: "Securitate", icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Setari</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestioneaza contul si preferintele</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-testid={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab.id
                    ? "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 bg-card rounded-lg border border-border p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Informatii profil</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary)/0.15)] flex items-center justify-center text-xl font-bold text-[hsl(var(--primary))]">
                  {user?.avatar}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Nume</Label>
                  <Input
                    data-testid="settings-name-input"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input
                    data-testid="settings-email-input"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button data-testid="save-profile-btn" onClick={handleSave} className="h-9 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground">
                  {saved ? <><Check className="w-4 h-4 mr-1.5" /> Salvat</> : <><Save className="w-4 h-4 mr-1.5" /> Salveaza</>}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Preferinte notificari</h3>
              <p className="text-sm text-muted-foreground">Notificarile vor fi disponibile in curand.</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>Securitate</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Parola actuala</Label>
                  <Input type="password" placeholder="Parola curenta" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Parola noua</Label>
                  <Input type="password" placeholder="Parola noua" className="h-10" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button data-testid="change-password-btn" onClick={handleSave} className="h-9 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground">
                  {saved ? <><Check className="w-4 h-4 mr-1.5" /> Salvat</> : <><Save className="w-4 h-4 mr-1.5" /> Schimba parola</>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
