export type ToggleKey = "lunch" | "subs" | "walk";

export interface ToggleDef {
  key: ToggleKey;
  label: string;
  sub: string;
  saving: number;
}

export const TOGGLE_DEFS: ToggleDef[] = [
  { key: "lunch", label: "Llevar mi almuerzo", sub: "Cocinar en casa 4 días/sem", saving: 300_000 },
  { key: "subs", label: "Optimizar suscripciones", sub: "Compartir streaming · cancelar duplicados", saving: 60_000 },
  { key: "walk", label: "Caminar al campus", sub: "Reducir Uber y transporte privado", saving: 40_000 },
];

export interface SimulatorInputs {
  income: number;
  expenses: number;
  investPct: number;
  active: Record<ToggleKey, boolean>;
}

export interface SimulatorMetrics {
  totalSavings: number;
  adjustedExpenses: number;
  surplus: number;
  monthlyInvest: number;
  totalContrib: number;
  interest: number;
  futureWealth: number;
}

export interface Scenario {
  id: string;
  name: string;
  createdAt: number;
  inputs: SimulatorInputs;
  metrics: SimulatorMetrics;
}

export const DEFAULT_INPUTS: SimulatorInputs = {
  income: 1_800_000,
  expenses: 1_400_000,
  investPct: 40,
  active: { lunch: false, subs: false, walk: false },
};

export const STORAGE_KEY = "finuni:simulator:v1";
export const SCENARIOS_KEY = "finuni:scenarios:v1";

export const computeMetrics = (i: SimulatorInputs): SimulatorMetrics => {
  const totalSavings = TOGGLE_DEFS.reduce((s, t) => (i.active[t.key] ? s + t.saving : s), 0);
  const adjustedExpenses = Math.max(0, i.expenses - totalSavings);
  const surplus = Math.max(0, i.income - adjustedExpenses);
  const monthlyInvest = (surplus * i.investPct) / 100;
  const r = Math.pow(1 + 0.08, 1 / 12) - 1;
  const futureWealth =
    monthlyInvest > 0 ? monthlyInvest * ((Math.pow(1 + r, 12) - 1) / r) * (1 + r) : 0;
  const totalContrib = monthlyInvest * 12;
  const interest = futureWealth - totalContrib;
  return { totalSavings, adjustedExpenses, surplus, monthlyInvest, totalContrib, interest, futureWealth };
};

export interface MilestoneState {
  firstSavings: boolean;
  etfInvestor: boolean;
  budgetMaster: boolean;
}

export const evaluateMilestones = (i: SimulatorInputs, m: SimulatorMetrics): MilestoneState => ({
  firstSavings: m.totalSavings > 100_000 || m.surplus > 100_000,
  etfInvestor: i.investPct > 10,
  budgetMaster: i.active.lunch && i.active.subs && i.active.walk,
});
