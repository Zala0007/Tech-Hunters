// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const mapRoutes = require('./routes/mapRoutes');
const assetRoutes = require('./routes/assetRoutes');
const demandRoutes = require('./routes/demandRoutes');
const siteRoutes = require('./routes/siteRoutes');
const transportRoutes = require('./routes/transportRoutes');
const policyRoutes = require('./routes/policyRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');

const { errorMiddleware } = require('./middleware/errorMiddleware');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/demand', demandRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/scenario', scenarioRoutes);

// Error Handling Middleware (last)
app.use(errorMiddleware);

module.exports = app;
