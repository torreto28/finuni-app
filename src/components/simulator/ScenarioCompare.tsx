import { useState } from "react";
import { Bookmark, Trash2, Upload, Plus } from "lucide-react";
import { Scenario, SimulatorInputs, SimulatorMetrics } from "@/lib/simulatorState";
import { formatCOP } from "@/lib/format";
import { Input } from "@/components/ui/input";

interface Props {
  scenarios: Scenario[];
  current: { inputs: SimulatorInputs; metrics: SimulatorMetrics };
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
  onLoad: (id: string) => void;
}

const ScenarioCompare = ({ scenarios, current, onSave, onDelete, onLoad }: Props) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    onSave(name || `Escenario ${String.fromCharCode(65 + scenarios.length)}`);
    setName("");
  };

  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-card animate-fade-up">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Comparador</p>
          <h3 className="font-serif text-2xl text-primary mt-1">Compara escenarios</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Guarda hasta 5 escenarios y contrástalos lado a lado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Escenario ${String.fromCharCode(65 + scenarios.length)}`}
            className="h-10 w-44 rounded-full text-sm"
          />
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-glow active:scale-[0.98] transition-smooth shadow-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus className="h-3.5 w-3.5" />
            Guardar escenario
          </button>
        </div>
      </div>

      {scenarios.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <Bookmark className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Aún no has guardado escenarios. Guarda tu simulación actual para empezar a comparar.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <Th>Escenario</Th>
                <Th align="right">Inv. mensual</Th>
                <Th align="right">Ahorro hábitos</Th>
                <Th align="right">Riqueza 12m</Th>
                <Th align="right">% invertido</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-accent-soft/40 border-t border-border">
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="font-medium text-primary">Actual</span>
                  </div>
                </Td>
                <Td align="right">{formatCOP(current.metrics.monthlyInvest)}</Td>
                <Td align="right">{formatCOP(current.metrics.totalSavings)}</Td>
                <Td align="right" className="font-semibold text-primary">
                  {formatCOP(current.metrics.futureWealth)}
                </Td>
                <Td align="right">{current.inputs.investPct}%</Td>
                <Td align="right">—</Td>
              </tr>
              {scenarios.map((s) => {
                const diff = s.metrics.futureWealth - current.metrics.futureWealth;
                return (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/40 transition-smooth">
                    <Td>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{s.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(s.createdAt).toLocaleDateString("es-CO")}
                        </span>
                      </div>
                    </Td>
                    <Td align="right">{formatCOP(s.metrics.monthlyInvest)}</Td>
                    <Td align="right">{formatCOP(s.metrics.totalSavings)}</Td>
                    <Td align="right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold tabular-nums">{formatCOP(s.metrics.futureWealth)}</span>
                        {diff !== 0 && (
                          <span className={`text-[10px] ${diff > 0 ? "text-success" : "text-destructive"}`}>
                            {diff > 0 ? "+" : ""}
                            {formatCOP(diff, { compact: true })} vs actual
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td align="right">{s.inputs.investPct}%</Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onLoad(s.id)}
                          title="Cargar"
                          className="p-2 rounded-full hover:bg-primary/10 text-primary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Upload className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(s.id)}
                          title="Eliminar"
                          className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const Th = ({ children, align }: { children: React.ReactNode; align?: "right" }) => (
  <th
    className={`px-4 py-3 text-[11px] uppercase tracking-wider font-medium text-muted-foreground ${
      align === "right" ? "text-right" : ""
    }`}
  >
    {children}
  </th>
);

const Td = ({
  children,
  align,
  className,
}: {
  children: React.ReactNode;
  align?: "right";
  className?: string;
}) => (
  <td
    className={`px-4 py-3 tabular-nums text-foreground ${align === "right" ? "text-right" : ""} ${
      className ?? ""
    }`}
  >
    {children}
  </td>
);

export default ScenarioCompare;
