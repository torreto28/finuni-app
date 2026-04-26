import { Info, TrendingUp, ArrowUpRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCOP } from "@/lib/format";

const StrategicInvestment = () => {
  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Decision Engine</p>
          <h3 className="font-serif text-2xl text-primary mt-1">Inversión Estratégica</h3>
        </div>
        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-success/10 text-success border border-success/30">
          <ArrowUpRight className="h-3 w-3" /> Recomendado
        </span>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-5 items-center p-5 rounded-2xl bg-gradient-parchment border border-border/60">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-2xl text-primary">ETF S&amp;P 500 · VOO</span>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Por qué este activo"
                  className="h-6 w-6 grid place-items-center rounded-full bg-secondary text-primary border border-border hover:bg-accent-soft hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-80 bg-gradient-parchment border-accent/40 shadow-gold p-5 rounded-2xl"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">¿Por qué este activo?</p>
                <p className="font-serif text-lg text-primary mt-2 leading-snug">
                  Diversificación instantánea, bajo costo.
                </p>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                  Es una colección de las <span className="font-semibold text-primary">500 empresas más grandes de EE.UU.</span>,
                  ofreciendo diversificación inmediata para estudiantes a un costo mínimo.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-card border border-border/60">
                    <p className="text-[10px] text-muted-foreground">Costo</p>
                    <p className="text-sm font-semibold text-primary">0.03%</p>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/60">
                    <p className="text-[10px] text-muted-foreground">Histórico</p>
                    <p className="text-sm font-semibold text-primary">~10% E.A.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/60">
                    <p className="text-[10px] text-muted-foreground">Riesgo</p>
                    <p className="text-sm font-semibold text-primary">Medio</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Aporte automático sugerido · {formatCOP(250_000)} / mes
          </p>
        </div>

        <div className="flex items-center gap-2 text-success font-semibold">
          <TrendingUp className="h-4 w-4" />
          <span className="tabular-nums">+8.2% YTD</span>
        </div>
      </div>
    </section>
  );
};

export default StrategicInvestment;
