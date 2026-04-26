import { Leaf, BookOpen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { formatCOP } from "@/lib/format";

interface PredictiveHealthProps {
  examMode: boolean;
  onExamToggle: (v: boolean) => void;
}

const HealthBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex items-center justify-between text-xs mb-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-primary tabular-nums">{value}</span>
    </div>
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full bg-gradient-forest rounded-full"
        style={{ width: `${value}%`, transition: "width 0.4s var(--ease-smooth)" }}
      />
    </div>
  </div>
);

const PredictiveHealth = ({ examMode, onExamToggle }: PredictiveHealthProps) => {
  return (
    <div
      className={`rounded-3xl bg-card border border-border p-6 shadow-card transition-smooth ${
        examMode ? "exam-glow" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Salud Predictiva</p>
        <div className="h-8 w-8 rounded-full bg-accent-soft grid place-items-center">
          <Leaf className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-semibold text-primary">A-</span>
        <span className="text-sm text-muted-foreground">Score 86 / 100</span>
      </div>

      <div className="mt-5 space-y-3">
        <HealthBar label="Disciplina de ahorro" value={82} />
        <HealthBar label="Diversificación" value={68} />
        <HealthBar label="Liquidez 30 días" value={91} />
      </div>

      {/* Exam mode toggle */}
      <div
        className={`mt-5 flex items-center justify-between gap-3 p-3 rounded-2xl border transition-smooth ${
          examMode
            ? "bg-[hsl(212_90%_55%/0.08)] border-[hsl(212_90%_55%/0.35)]"
            : "bg-secondary/60 border-border/60"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen
            className={`h-4 w-4 shrink-0 transition-smooth ${
              examMode ? "text-[hsl(212_90%_45%)]" : "text-muted-foreground"
            }`}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Modo Exámenes</p>
            <p className="text-[11px] text-muted-foreground truncate">Calendario académico activo</p>
          </div>
        </div>
        <Switch checked={examMode} onCheckedChange={onExamToggle} aria-label="Modo Exámenes" />
      </div>

      <div
        className={`mt-4 p-4 rounded-2xl border text-sm transition-smooth ${
          examMode
            ? "bg-[hsl(212_90%_55%/0.06)] border-[hsl(212_90%_55%/0.25)] text-foreground"
            : "bg-secondary/60 border-border/60 text-foreground"
        }`}
      >
        {examMode ? (
          <p>
            <span className="font-semibold text-[hsl(212_90%_35%)]">Período de alto estrés detectado.</span>{" "}
            Pasamos tu Radar de Inversión a <span className="font-semibold">'Modo Mantenimiento'</span> para ahorrarte energía mental.
          </p>
        ) : (
          <p>
            Tu trayectoria proyecta <span className="font-semibold text-primary">+{formatCOP(4_120_000, { compact: true })}</span> al cierre del semestre.
          </p>
        )}
      </div>
    </div>
  );
};

export default PredictiveHealth;
