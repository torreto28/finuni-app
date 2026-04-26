import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TOGGLE_DEFS, SimulatorInputs } from "@/lib/simulatorState";
import { formatCOP } from "@/lib/format";

interface Props {
  inputs: SimulatorInputs;
}

const BreakdownChart = ({ inputs }: Props) => {
  const r = Math.pow(1 + 0.08, 1 / 12) - 1;
  const fvFactor = ((Math.pow(1 + r, 12) - 1) / r) * (1 + r);
  const pct = inputs.investPct / 100;

  const data = TOGGLE_DEFS.map((t) => {
    const monthlyImpact = inputs.active[t.key] ? t.saving * pct : 0;
    const futureImpact = monthlyImpact * fvFactor;
    return {
      name: t.label.split(" ")[0],
      fullLabel: t.label,
      monthly: Math.round(monthlyImpact),
      future: Math.round(futureImpact),
      active: inputs.active[t.key],
    };
  });

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Breakdown</p>
        <span className="text-[11px] text-muted-foreground">12 meses @ 8% E.A.</span>
      </div>
      <h3 className="font-serif text-xl text-primary">Impacto de cada hábito</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        Cómo cada hábito activado contribuye a la inversión mensual y a la riqueza futura.
      </p>

      <div className="h-56 animate-fade-up">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap={20}>
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCOP(v, { compact: true })}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                boxShadow: "var(--shadow-card)",
                fontSize: 12,
              }}
              formatter={(value: number, key) => [
                formatCOP(value),
                key === "monthly" ? "Inversión / mes" : "Riqueza futura",
              ]}
              labelFormatter={(l, payload) => payload?.[0]?.payload?.fullLabel ?? l}
            />
            <Bar dataKey="monthly" radius={[6, 6, 0, 0]} maxBarSize={28}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.active ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
              ))}
            </Bar>
            <Bar dataKey="future" radius={[6, 6, 0, 0]} maxBarSize={28}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.active ? "hsl(var(--accent))" : "hsl(var(--muted))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Inversión mensual
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-accent" /> Riqueza futura (12m)
        </span>
      </div>
    </div>
  );
};

export default BreakdownChart;
