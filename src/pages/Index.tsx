import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Dashboard from "@/components/Dashboard";
import Simulator from "@/components/Simulator";

const Index = () => {
  const [view, setView] = useState<"dashboard" | "simulator">("dashboard");

  return (
    <div className="min-h-screen bg-gradient-parchment">
      <AppHeader view={view} onNavigate={setView} />
      <main key={view} className="animate-fade-up">
        {view === "dashboard" ? <Dashboard /> : <Simulator />}
      </main>
      <footer className="container max-w-6xl py-10 text-center text-xs text-muted-foreground">
        FinUni · Academic Wealth · Universidad de Medellín — Ciencia y Libertad
      </footer>
    </div>
  );
};

export default Index;
