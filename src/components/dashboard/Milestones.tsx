import { useEffect, useRef, useState } from "react";
import { PiggyBank, LineChart, Trophy, Lock, Check } from "lucide-react";
import { MilestoneState } from "@/lib/simulatorState";

export type { MilestoneState };

interface MilestonesProps {
  state: MilestoneState;
}

const items = [
  {
    key: "firstSavings" as const,
    label: "Primer Paso",
    sub: "Ahorra más de $100k al mes",
    Icon: PiggyBank,
  },
  {
    key: "etfInvestor" as const,
    label: "Inversionista Novato",
    sub: "Asigna más del 10% a inversión",
    Icon: LineChart,
  },
  {
    key: "budgetMaster" as const,
    label: "Maestro del Presupuesto",
    sub: "Activa los 3 hábitos de lifestyle",
    Icon: Trophy,
  },
];

const Milestones = ({ state }: MilestonesProps) => {
  // Track which milestones just transitioned to unlocked → trigger pop animation once.
  const prev = useRef<MilestoneState>(state);
  const [justUnlocked, setJustUnlocked] = useState<Record<keyof MilestoneState, boolean>>({
    firstSavings: false,
    etfInvestor: false,
    budgetMaster: false,
  });

  useEffect(() => {
    const transitions: Partial<Record<keyof MilestoneState, boolean>> = {};
    (Object.keys(state) as (keyof MilestoneState)[]).forEach((k) => {
      if (state[k] && !prev.current[k]) transitions[k] = true;
    });
    if (Object.keys(transitions).length > 0) {
      setJustUnlocked((s) => ({ ...s, ...transitions }));
      const t = setTimeout(
        () =>
          setJustUnlocked({ firstSavings: false, etfInvestor: false, budgetMaster: false }),
        700,
      );
      prev.current = state;
      return () => clearTimeout(t);
    }
    prev.current = state;
  }, [state]);

  const unlockedCount = Object.values(state).filter(Boolean).length;

  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Gamificación</p>
          <h3 className="font-serif text-2xl text-primary mt-1">Logros Financieros</h3>
        </div>
        <p className="text-xs text-muted-foreground">{unlockedCount}/3 desbloqueados</p>
      </div>

      <ul className="grid sm:grid-cols-3 gap-4">
        {items.map(({ key, label, sub, Icon }) => {
          const unlocked = state[key];
          const popping = justUnlocked[key];
          return (
            <li
              key={key}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-smooth ${
                unlocked
                  ? "bg-gradient-parchment border-accent/40 shadow-gold"
                  : "bg-secondary/40 border-border/60 hover:border-primary/20"
              } ${popping ? "animate-unlock" : ""}`}
            >
              {unlocked && (
                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
              )}

              <div className="relative flex items-start justify-between">
                <div
                  className={`h-12 w-12 rounded-2xl grid place-items-center transition-smooth ${
                    unlocked
                      ? "bg-gradient-gold text-primary shadow-gold"
                      : "bg-card border border-border text-muted-foreground"
                  } ${unlocked ? "animate-float" : ""}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${
                    unlocked
                      ? "bg-success/15 text-success border border-success/30"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {unlocked ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {unlocked ? "Logrado" : "Bloqueado"}
                </span>
              </div>

              <div className="relative mt-4">
                <p
                  className={`font-serif text-lg ${
                    unlocked ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Milestones;
