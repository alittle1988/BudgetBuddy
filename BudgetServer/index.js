// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDb } = require('./config/db');
const { authMiddleware } = require('./middleware/auth');
const { rateLimit } = require('./middleware/rateLimit');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const incomeRoutes = require('./routes/incomes');
const netWorthRoutes = require('./routes/netWorth');
const userRoutes = require('./routes/users');

const app = express();

// ----- Middlewares -----
const allowList = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const corsOptions = allowList.length
  ? {
      origin: allowList,
      credentials: true,
    }
  : {}; // open in dev

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', rateLimit);

// ----- Routes -----
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/net-worth', netWorthRoutes);
app.use('/api/users', userRoutes);

// ----- Start -----
const PORT = process.env.PORT || 4000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
});
