const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, '../public')));
// Serve assets from /assets
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// API Routes
app.use('/api', apiRoutes);

// Fallback to index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`FinUni Server running on http://localhost:${PORT}`);
});

module.exports = app;
