import jsPDF from "jspdf";
import { formatCOP } from "./format";
import { Scenario } from "./simulatorState";

export interface SimulationSnapshot {
  income: number;
  expenses: number;
  investPct: number;
  totalSavings: number;
  surplus: number;
  monthlyInvest: number;
  totalContrib: number;
  interest: number;
  futureWealth: number;
  habits: { label: string; saving: number; active: boolean }[];
  scenarios?: Scenario[];
}

// Brand colors (RGB)
const FOREST: [number, number, number] = [6, 78, 59];
const GOLD: [number, number, number] = [212, 175, 55];
const PARCHMENT: [number, number, number] = [250, 247, 240];
const INK: [number, number, number] = [20, 41, 33];
const MUTED: [number, number, number] = [110, 120, 115];

export const exportSimulationPdf = (s: SimulationSnapshot) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;

  const paintBackground = () => {
    doc.setFillColor(...PARCHMENT);
    doc.rect(0, 0, W, H, "F");
  };

  const paintFooter = () => {
    doc.setDrawColor(220, 215, 205);
    doc.line(M, H - 50, W - M, H - 50);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "FinUni · Academic Wealth · Universidad de Medellín — Ciencia y Libertad",
      W / 2,
      H - 30,
      { align: "center" },
    );
    doc.text(
      "Proyección basada en rendimiento histórico de ETF diversificado. No constituye asesoría financiera.",
      W / 2,
      H - 18,
      { align: "center" },
    );
  };

  paintBackground();

  // Header band
  doc.setFillColor(...FOREST);
  doc.rect(0, 0, W, 110, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("FINUNI · ACADEMIC WEALTH", M, 44);

  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text("Resumen de Simulación", M, 78);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(220, 220, 210);
  const date = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  doc.text(date, W - M, 44, { align: "right" });

  let y = 150;

  // Wealth projection hero card
  doc.setFillColor(...FOREST);
  doc.roundedRect(M, y, W - M * 2, 110, 14, 14, "F");
  doc.setTextColor(220, 230, 220);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("PROYECCIÓN DE RIQUEZA · 12 MESES @ 8% E.A.", M + 24, y + 28);

  doc.setTextColor(...GOLD);
  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.text(formatCOP(s.futureWealth), M + 24, y + 70);

  doc.setTextColor(220, 230, 220);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `Aporte mensual: ${formatCOP(s.monthlyInvest)}  ·  Rendimiento: +${formatCOP(s.interest)}`,
    M + 24,
    y + 92,
  );

  y += 140;

  const sectionTitle = (title: string) => {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(title.toUpperCase(), M, y);
    y += 6;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.line(M, y, M + 36, y);
    y += 18;
  };

  sectionTitle("Tus parámetros");

  const row = (label: string, value: string, highlight = false) => {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(M, y, W - M * 2, 32, 8, 8, "F");
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, M + 16, y + 21);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    if (highlight) doc.setTextColor(...FOREST);
    doc.text(value, W - M - 16, y + 21, { align: "right" });
    y += 38;
  };

  row("Ingreso mensual", formatCOP(s.income));
  row("Gastos base", formatCOP(s.expenses));
  row("% del excedente a invertir", `${s.investPct}%`);
  row("Excedente mensual", formatCOP(s.surplus), true);

  y += 8;
  sectionTitle("Hábitos activados");

  const activeHabits = s.habits.filter((h) => h.active);
  if (activeHabits.length === 0) {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Ningún hábito activado en esta simulación.", M, y + 4);
    y += 24;
  } else {
    activeHabits.forEach((h) => {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(M, y, W - M * 2, 30, 8, 8, "F");
      doc.setFillColor(...GOLD);
      doc.circle(M + 16, y + 15, 3.5, "F");
      doc.setTextColor(...INK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(h.label, M + 28, y + 19);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...FOREST);
      doc.text(`+ ${formatCOP(h.saving)}/mes`, W - M - 16, y + 19, { align: "right" });
      y += 36;
    });
  }

  y += 12;
  sectionTitle("Resumen anual");

  row("Capital aportado (12 meses)", formatCOP(s.totalContrib));
  row("Rendimiento estimado", `+ ${formatCOP(s.interest)}`, true);
  row("Riqueza futura proyectada", formatCOP(s.futureWealth), true);

  // Scenarios comparison page (if any)
  if (s.scenarios && s.scenarios.length > 0) {
    doc.addPage();
    paintBackground();

    // Slim header
    doc.setFillColor(...FOREST);
    doc.rect(0, 0, W, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("FINUNI · COMPARADOR DE ESCENARIOS", M, 32);
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Escenarios guardados", M, 56);

    y = 110;

    // Table header
    const colX = [M, M + 180, M + 300, M + 420];
    doc.setFillColor(...FOREST);
    doc.roundedRect(M, y, W - M * 2, 28, 6, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("ESCENARIO", colX[0] + 12, y + 18);
    doc.text("INV. MENSUAL", colX[1], y + 18);
    doc.text("AHORRO HÁBITOS", colX[2], y + 18);
    doc.text("RIQUEZA 12M", W - M - 12, y + 18, { align: "right" });
    y += 36;

    // Current row first
    const drawRow = (
      name: string,
      sub: string,
      monthly: number,
      savings: number,
      future: number,
      isCurrent = false,
    ) => {
      doc.setFillColor(isCurrent ? 244 : 255, isCurrent ? 235 : 255, isCurrent ? 200 : 255);
      doc.roundedRect(M, y, W - M * 2, 38, 6, 6, "F");
      doc.setTextColor(...INK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(name, colX[0] + 12, y + 17);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(sub, colX[0] + 12, y + 30);

      doc.setTextColor(...INK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(formatCOP(monthly, { compact: true }), colX[1], y + 22);
      doc.text(formatCOP(savings, { compact: true }), colX[2], y + 22);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...FOREST);
      doc.text(formatCOP(future, { compact: true }), W - M - 12, y + 22, { align: "right" });
      y += 44;
    };

    drawRow(
      "Actual",
      "Simulación en pantalla",
      s.monthlyInvest,
      s.totalSavings,
      s.futureWealth,
      true,
    );

    s.scenarios.forEach((sc) => {
      if (y > H - 120) {
        paintFooter();
        doc.addPage();
        paintBackground();
        y = M;
      }
      drawRow(
        sc.name,
        new Date(sc.createdAt).toLocaleDateString("es-CO"),
        sc.metrics.monthlyInvest,
        sc.metrics.totalSavings,
        sc.metrics.futureWealth,
      );
    });
  }

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    paintFooter();
  }

  doc.save(`FinUni-Simulacion-${Date.now()}.pdf`);
};
