import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, Sandwich, Tv, Footprints, ArrowRight, FileDown, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { formatCOP } from "@/lib/format";
import { exportSimulationPdf } from "@/lib/exportPdf";
import { TOGGLE_DEFS, ToggleKey } from "@/lib/simulatorState";
import { useSimulator } from "@/hooks/useSimulator";
import BreakdownChart from "./simulator/BreakdownChart";
import ScenarioCompare from "./simulator/ScenarioCompare";

const TOGGLE_ICONS: Record<ToggleKey, typeof Sandwich> = {
  lunch: Sandwich,
  subs: Tv,
  walk: Footprints,
};

const Simulator = () => {
  const {
    inputs,
    metrics,
    scenarios,
    setIncome,
    setExpenses,
    setInvestPct,
    toggle,
    reset,
    saveScenario,
    deleteScenario,
    loadScenario,
  } = useSimulator();

  const { income, expenses, investPct, active } = inputs;
  const { totalSavings, surplus, monthlyInvest, totalContrib, interest, futureWealth } = metrics;

  const handleSaveProgress = () => {
    // Persistence is automatic via useEffect — this is the explicit confirmation action.
    toast.success("Simulación guardada correctamente.", {
      description: "Tus parámetros y hábitos se mantendrán al recargar.",
    });
  };

  const handleExport = () => {
    exportSimulationPdf({
      income,
      expenses,
      investPct,
      totalSavings,
      surplus,
      monthlyInvest,
      totalContrib,
      interest,
      futureWealth,
      habits: TOGGLE_DEFS.map((t) => ({
        label: t.label,
        saving: t.saving,
        active: active[t.key],
      })),
      scenarios,
    });
  };

  const handleSaveScenario = (name: string) => {
    const sc = saveScenario(name);
    toast.success(`"${sc.name}" guardado.`, {
      description: "Disponible en el comparador de escenarios.",
    });
  };

  return (
    <div className="container max-w-6xl py-8 space-y-8 animate-fade-up">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">Decision Engine · Metodología SCAMPER</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-primary leading-tight mt-1">
            Simulador de Riqueza Futura
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            Ajusta tus hábitos y observa cómo cambia tu proyección a 12 meses al 8% E.A.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted active:scale-[0.98] transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
          <button
            onClick={handleSaveProgress}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-xs font-medium hover:opacity-95 active:scale-[0.98] transition-smooth shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Save className="h-3.5 w-3.5" />
            Guardar progreso
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-glow active:scale-[0.98] transition-smooth shadow-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <FileDown className="h-3.5 w-3.5" />
            Exportar PDF
          </button>
          <div className="flex items-center gap-2 bg-accent-soft text-accent-foreground px-4 py-2 rounded-full text-xs font-medium border border-accent/30">
            <Sparkles className="h-3.5 w-3.5" />
            Recálculo instantáneo
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs column */}
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-card space-y-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tus parámetros</p>

            <div className="space-y-2">
              <Label htmlFor="income" className="text-sm">Ingreso mensual (COP)</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                className="h-12 text-base font-medium tabular-nums rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp" className="text-sm">Gastos mensuales (COP)</Label>
              <Input
                id="exp"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Math.max(0, Number(e.target.value) || 0))}
                className="h-12 text-base font-medium tabular-nums rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">% del excedente a invertir</Label>
                <span className="font-serif text-2xl font-semibold text-primary tabular-nums">{investPct}%</span>
              </div>
              <Slider
                value={[investPct]}
                onValueChange={(v) => setInvestPct(v[0])}
                min={0}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Conservador</span><span>Agresivo</span>
              </div>
            </div>
          </div>

          {/* Lifestyle Toggles */}
          <div className="rounded-3xl bg-card border border-border p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lifestyle Toggles</p>
            <h3 className="font-serif text-xl text-primary mt-1 mb-4">Hábitos que generan riqueza</h3>

            <ul className="space-y-3">
              {TOGGLE_DEFS.map(({ key, label, sub, saving }) => {
                const Icon = TOGGLE_ICONS[key];
                const on = active[key];
                return (
                  <li
                    key={key}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-smooth cursor-pointer ${
                      on
                        ? "bg-primary/5 border-primary/30 shadow-soft"
                        : "bg-secondary/40 border-border hover:border-primary/20"
                    }`}
                    onClick={() => toggle(key)}
                  >
                    <div className={`h-10 w-10 rounded-xl grid place-items-center transition-smooth ${
                      on ? "bg-primary text-primary-foreground" : "bg-card text-primary"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground">{sub} · ahorra {formatCOP(saving, { compact: true })}/mes</p>
                    </div>
                    <Switch checked={on} onCheckedChange={(v) => toggle(key, v)} onClick={(e) => e.stopPropagation()} />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Output column */}
        <section className="lg:col-span-3 space-y-6">
          {/* Wealth projection hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-card-dark text-primary-foreground p-8 shadow-forest">
            <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-primary-glow/30 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
                <TrendingUp className="h-3.5 w-3.5 text-accent" /> Wealth Projection · 12 meses
              </div>

              <p
                key={Math.round(futureWealth)}
                className="font-serif text-5xl sm:text-6xl font-semibold mt-4 tracking-tight animate-count-pop"
              >
                {formatCOP(futureWealth)}
              </p>
              <p className="text-sm text-primary-foreground/70 mt-2">
                Con un rendimiento estimado del <span className="text-accent font-medium">8% E.A.</span> (ETF diversificado)
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-primary-foreground/10">
                <Mini label="Aporte mensual" value={formatCOP(monthlyInvest, { compact: true })} />
                <Mini label="Capital aportado" value={formatCOP(totalContrib, { compact: true })} />
                <Mini label="Rendimiento" value={`+${formatCOP(interest, { compact: true })}`} highlight />
              </div>
            </div>
          </div>

          <BreakdownChart inputs={inputs} />

          {/* Excedente / Insight */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-card">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Excedente mensual</p>
              <p className="font-serif text-3xl text-primary mt-3 tabular-nums">{formatCOP(surplus)}</p>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Ingreso" value={formatCOP(income)} />
                <Row label="Gastos base" value={`− ${formatCOP(expenses)}`} />
                <Row label="Ahorro por hábitos" value={`+ ${formatCOP(totalSavings)}`} positive />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-parchment border border-border p-6 shadow-card flex flex-col">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Insight</p>
              <p className="font-serif text-xl text-primary mt-2 leading-snug">
                {totalSavings > 0
                  ? `Activaste ${Object.values(active).filter(Boolean).length} hábito(s).`
                  : "Activa un hábito para ver el efecto compuesto."}
              </p>
              <p className="text-sm text-muted-foreground mt-2 flex-1">
                Cada {formatCOP(10_000, { compact: true })} mensuales redirigidos hoy se convierten en
                <span className="text-primary font-semibold"> {formatCOP(125_000, { compact: true })}</span> en 5 años.
              </p>

              <button className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-glow active:scale-[0.98] transition-smooth shadow-forest group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Activar plan automático
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-smooth" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <ScenarioCompare
        scenarios={scenarios}
        current={{ inputs, metrics }}
        onSave={handleSaveScenario}
        onDelete={(id) => {
          deleteScenario(id);
          toast("Escenario eliminado.");
        }}
        onLoad={(id) => {
          loadScenario(id);
          toast.success("Escenario cargado en el simulador.");
        }}
      />
    </div>
  );
};

const Mini = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wider text-primary-foreground/60">{label}</p>
    <p className={`font-serif text-xl font-semibold mt-1 tabular-nums ${highlight ? "text-accent" : ""}`}>{value}</p>
  </div>
);

const Row = ({ label, value, positive }: { label: string; value: string; positive?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={`tabular-nums font-medium ${positive ? "text-success" : "text-foreground"}`}>{value}</span>
  </div>
);

export default Simulator;
