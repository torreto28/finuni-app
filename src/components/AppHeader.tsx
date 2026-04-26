import udemLogo from "@/assets/udem-logo.png";
import { Bell } from "lucide-react";

interface AppHeaderProps {
  view: "dashboard" | "simulator";
  onNavigate: (v: "dashboard" | "simulator") => void;
}

const AppHeader = ({ view, onNavigate }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/75 border-b border-border/60">
      <div className="container max-w-6xl flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full overflow-hidden ring-2 ring-accent/40 shadow-soft">
            <img src={udemLogo} alt="Universidad de Medellín" className="h-full w-full object-cover" />
          </div>
          <div className="leading-tight">
            <p className="font-serif text-lg font-semibold text-primary">FinUni</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Academic Wealth</p>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-1 bg-secondary/70 p-1 rounded-full border border-border/60">
          {(["dashboard", "simulator"] as const).map((key) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-smooth ${
                view === key
                  ? "bg-primary text-primary-foreground shadow-forest"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {key === "dashboard" ? "Dashboard" : "Simulador"}
            </button>
          ))}
        </nav>

        <button
          aria-label="Notificaciones"
          className="relative h-10 w-10 grid place-items-center rounded-full bg-secondary/70 border border-border/60 hover:bg-secondary transition-smooth"
        >
          <Bell className="h-4 w-4 text-primary" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
      </div>

      {/* Mobile nav */}
      <nav className="sm:hidden flex justify-center pb-3">
        <div className="flex items-center gap-1 bg-secondary/70 p-1 rounded-full border border-border/60">
          {(["dashboard", "simulator"] as const).map((key) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`px-5 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                view === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {key === "dashboard" ? "Dashboard" : "Simulador"}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
