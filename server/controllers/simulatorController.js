exports.calculateGrowth = (req, res) => {
    const {
        income,
        essentialExpenses,
        discretionaryExpenses,
        currentSavings,
        timeHorizonMonths,
        expectedReturn
    } = req.body;

    if ([income, essentialExpenses, discretionaryExpenses, currentSavings].some(v => v === undefined)) {
        return res.status(400).json({ error: 'Faltan entradas financieras requeridas' });
    }

    const monthlySavings = income - (essentialExpenses + discretionaryExpenses);
    const ratePerMonth = (expectedReturn || 0.07) / 12;
    const months = timeHorizonMonths || 12;

    // Compound Interest Formula: FV = P(1+r)^n + PMT * [((1+r)^n - 1) / r]
    const compoundFactor = Math.pow(1 + ratePerMonth, months);
    const totalProjected = (currentSavings * compoundFactor) +
                           (monthlySavings * (compoundFactor - 1) / ratePerMonth);

    const growthAmount = totalProjected - (currentSavings + (monthlySavings * months));

    // SCAMPER based strategy recommendations (Localized)
    let strategy = "Mantén la trayectoria actual.";
    if (discretionaryExpenses > income * 0.3) {
        strategy = "S (Sustituir): Reemplaza el gasto discrecional elevado por micro-inversiones para impulsar la proyección en un 15%.";
    } else if (monthlySavings < 0) {
        strategy = "E (Eliminar): Identifica y elimina suscripciones redundantes para volver tu flujo de caja mensual positivo.";
    } else if (monthlySavings > income * 0.2) {
        strategy = "M (Modificar): Tu tasa de ahorro es alta. Modifica la asignación hacia señales del 'Radar de Inversiones' de mayor rendimiento.";
    } else {
        strategy = "A (Adaptar): Adapta tus patrones de gasto a las señales verdes del 'Análisis de Bolsillo' para optimizar la liquidez.";
    }

    res.json({
        monthlySavings,
        totalProjected: Math.max(0, totalProjected),
        growthAmount: Math.max(0, growthAmount),
        strategyRecommendation: strategy
    });
};
