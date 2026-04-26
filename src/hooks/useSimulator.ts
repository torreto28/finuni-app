import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_INPUTS,
  STORAGE_KEY,
  SCENARIOS_KEY,
  SimulatorInputs,
  Scenario,
  computeMetrics,
  evaluateMilestones,
  ToggleKey,
} from "@/lib/simulatorState";

const loadInputs = (): SimulatorInputs => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INPUTS;
    const parsed = JSON.parse(raw) as Partial<SimulatorInputs>;
    return {
      ...DEFAULT_INPUTS,
      ...parsed,
      active: { ...DEFAULT_INPUTS.active, ...(parsed.active ?? {}) },
    };
  } catch {
    return DEFAULT_INPUTS;
  }
};

const loadScenarios = (): Scenario[] => {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Scenario[];
  } catch {
    return [];
  }
};

export const useSimulator = () => {
  const [inputs, setInputs] = useState<SimulatorInputs>(loadInputs);
  const [scenarios, setScenarios] = useState<Scenario[]>(loadScenarios);

  // Auto-persist inputs across refreshes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      /* ignore quota errors */
    }
  }, [inputs]);

  useEffect(() => {
    try {
      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
    } catch {
      /* ignore */
    }
  }, [scenarios]);

  const metrics = useMemo(() => computeMetrics(inputs), [inputs]);
  const milestones = useMemo(() => evaluateMilestones(inputs, metrics), [inputs, metrics]);

  const setIncome = useCallback((v: number) => setInputs((s) => ({ ...s, income: v })), []);
  const setExpenses = useCallback((v: number) => setInputs((s) => ({ ...s, expenses: v })), []);
  const setInvestPct = useCallback((v: number) => setInputs((s) => ({ ...s, investPct: v })), []);
  const toggle = useCallback(
    (k: ToggleKey, v?: boolean) =>
      setInputs((s) => ({ ...s, active: { ...s.active, [k]: v ?? !s.active[k] } })),
    [],
  );

  const reset = useCallback(() => setInputs(DEFAULT_INPUTS), []);

  const saveScenario = useCallback(
    (name: string) => {
      const scenario: Scenario = {
        id: `s_${Date.now()}`,
        name: name.trim() || `Escenario ${scenarios.length + 1}`,
        createdAt: Date.now(),
        inputs,
        metrics,
      };
      setScenarios((prev) => [...prev, scenario].slice(-5));
      return scenario;
    },
    [inputs, metrics, scenarios.length],
  );

  const deleteScenario = useCallback(
    (id: string) => setScenarios((prev) => prev.filter((s) => s.id !== id)),
    [],
  );

  const loadScenario = useCallback((id: string) => {
    setScenarios((prev) => {
      const found = prev.find((s) => s.id === id);
      if (found) setInputs(found.inputs);
      return prev;
    });
  }, []);

  return {
    inputs,
    metrics,
    milestones,
    scenarios,
    setIncome,
    setExpenses,
    setInvestPct,
    toggle,
    reset,
    saveScenario,
    deleteScenario,
    loadScenario,
  };
};
