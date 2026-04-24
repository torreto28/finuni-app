document.getElementById('simulatorForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        income: parseFloat(document.getElementById('income').value),
        essentialExpenses: parseFloat(document.getElementById('essentialExpenses').value),
        discretionaryExpenses: parseFloat(document.getElementById('discretionaryExpenses').value),
        currentSavings: parseFloat(document.getElementById('currentSavings').value),
        timeHorizonMonths: parseInt(document.getElementById('timeHorizonMonths').value),
        expectedReturn: parseFloat(document.getElementById('expectedReturn').value) / 100
    };

    try {
        const response = await fetch('/api/simulator/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Calculation failed');

        const data = await response.json();
        updateUI(data);
    } catch (err) {
        alert('Error calculating projection: ' + err.message);
    }
});

function updateUI(data) {
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('resultPanel').classList.remove('hidden');

    const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    document.getElementById('totalProjected').textContent = fmt.format(data.totalProjected);
    document.getElementById('monthlySavings').textContent = fmt.format(data.monthlySavings);
    document.getElementById('growthAmount').textContent = fmt.format(data.growthAmount);
    document.getElementById('strategyRecommendation').textContent = data.strategyRecommendation;
}
