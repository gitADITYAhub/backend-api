const express = require('express');
const app = express();

app.use(express.json());

// Import routes
const eventsRoutes = require('./routes/eventsRoutes');

// Use routes
app.use('/api/events', eventsRoutes);

module.exports = app;
