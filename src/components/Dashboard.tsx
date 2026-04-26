import { useState } from "react";
import { Coffee, TrendingUp, TrendingDown, ArrowUpRight, Sparkles, Wallet, GraduationCap } from "lucide-react";
import { formatCOP } from "@/lib/format";
import PredictiveHealth from "./dashboard/PredictiveHealth";
import Milestones from "./dashboard/Milestones";
import StrategicInvestment from "./dashboard/StrategicInvestment";
import { useSimulator } from "@/hooks/useSimulator";

const Dashboard = () => {
  const balance = 2_840_000;
  const earned = 3_500_000;
  const spent = 1_820_000;
  const savings = 1_020_000;

  const [examMode, setExamMode] = useState(false);

  // Live milestones: derived from the persisted Simulator state
  const { milestones } = useSimulator();

  const expensesWeek = [320, 410, 280, 530, 380, 240, 190]; // in thousands
  const maxExp = Math.max(...expensesWeek);
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const transactions = [
    { icon: Coffee, label: "Café & Snacks", note: "Gasto hormiga · 12 ítems", amount: -148_000, tone: "warn" },
    { icon: GraduationCap, label: "Matrícula UdeM", note: "Cuota 3 de 4", amount: -890_000, tone: "neutral" },
    { icon: TrendingUp, label: "ETF S&P 500", note: "Aporte automático", amount: 250_000, tone: "good" },
    { icon: Wallet, label: "Mesada", note: "Ingreso recurrente", amount: 1_200_000, tone: "good" },
  ];

  return (
    <div className="container max-w-6xl py-8 space-y-8 animate-fade-up">
      {/* Greeting */}
      <section className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">Hola, Estudiante UdeM 👋</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-primary leading-tight mt-1">
            Tu riqueza académica,<br className="hidden sm:block" /> en movimiento.
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-accent-soft text-accent-foreground px-4 py-2 rounded-full text-xs font-medium border border-accent/30">
          <Sparkles className="h-3.5 w-3.5" />
          Modo Invertir-Primero activo
        </div>
      </section>

      {/* Hero balance card */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-card-dark text-primary-foreground p-8 shadow-forest">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-primary-glow/30 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">Balance disponible</p>
              <p className="font-serif text-5xl sm:text-6xl font-semibold mt-3 tracking-tight">
                {formatCOP(balance)}
              </p>
              <p className="text-sm text-primary-foreground/70 mt-2">•••• •••• 7845 · Vence 08/26</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-success/20 text-accent-soft border border-accent/30">
                <ArrowUpRight className="h-3 w-3" /> +12.4% mes
              </span>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-primary-foreground/10">
            <Stat label="Ingresado" value={formatCOP(earned, { compact: true })} dotClass="bg-accent" />
            <Stat label="Gastado" value={formatCOP(spent, { compact: true })} dotClass="bg-destructive/80" />
            <Stat label="Ahorrado" value={formatCOP(savings, { compact: true })} dotClass="bg-success" />
          </div>
        </div>

        <PredictiveHealth examMode={examMode} onExamToggle={setExamMode} />
      </section>

      {/* Milestones */}
      <Milestones state={milestones} />

      {/* Strategic Investment with educational tooltip */}
      <StrategicInvestment />

      {/* Pocket Analysis + Weekly */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-card border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pocket Analysis</p>
              <h3 className="font-serif text-2xl text-primary mt-1">Gastos esta semana</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-serif text-2xl font-semibold text-primary">{formatCOP(expensesWeek.reduce((a, b) => a + b, 0) * 1000, { compact: true })}</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2 sm:gap-4 h-44">
            {expensesWeek.map((v, i) => {
              const h = (v / maxExp) * 100;
              const isPeak = v === maxExp;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  {isPeak && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground shadow-gold">
                      ${v}k
                    </span>
                  )}
                  <div
                    className={`w-full rounded-t-full rounded-b-sm transition-smooth group-hover:opacity-90 ${
                      isPeak ? "bg-gradient-forest" : "bg-secondary"
                    }`}
                    style={{ height: `${Math.max(h, 8)}%` }}
                  />
                  <span className="text-[11px] text-muted-foreground">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-parchment border border-border p-6 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Gasto hormiga detectado</p>
            <Coffee className="h-4 w-4 text-accent" />
          </div>
          <p className="font-serif text-3xl text-primary mt-4">{formatCOP(148_000)}</p>
          <p className="text-sm text-muted-foreground mt-1">12 cafés en cafetería UdeM esta semana.</p>
          <div className="mt-5 p-4 rounded-2xl bg-card border border-border/60">
            <p className="text-xs text-muted-foreground">Si lo redirigieras a un ETF</p>
            <p className="font-serif text-2xl font-semibold text-primary mt-1">+ {formatCOP(2_140_000, { compact: true })}</p>
            <p className="text-[11px] text-muted-foreground">en 5 años · 8% anual</p>
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section className="rounded-3xl bg-card border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-2xl text-primary">Movimientos recientes</h3>
          <button className="text-xs text-primary font-medium hover:text-primary-glow transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full px-2 py-1">Ver todos →</button>
        </div>
        <ul className="divide-y divide-border/70">
          {transactions.map((t, i) => {
            const Icon = t.icon;
            const positive = t.amount > 0;
            return (
              <li key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group">
                <div className={`h-11 w-11 rounded-2xl grid place-items-center transition-smooth ${
                  t.tone === "good" ? "bg-accent-soft text-primary" :
                  t.tone === "warn" ? "bg-destructive/10 text-destructive" :
                  "bg-secondary text-primary"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.note}</p>
                </div>
                <div className={`flex items-center gap-1 font-semibold tabular-nums ${
                  positive ? "text-success" : "text-foreground"
                }`}>
                  {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />}
                  {positive ? "+" : ""}{formatCOP(t.amount)}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

const Stat = ({ label, value, dotClass }: { label: string; value: string; dotClass: string }) => (
  <div>
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <p className="text-[11px] uppercase tracking-wider text-primary-foreground/60">{label}</p>
    </div>
    <p className="font-serif text-xl sm:text-2xl font-semibold mt-1.5">{value}</p>
  </div>
);

export default Dashboard;
