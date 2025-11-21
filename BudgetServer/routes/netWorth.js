/* routes/netWorth.js */
const express = require('express');
const Transaction = require('../models/Transaction');
const Income = require('../models/Income');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [txs, incs] = await Promise.all([
      Transaction.find({ userId: req.userId }),
      Income.find({ userId: req.userId }),
    ]);

    const monthStats = {};

    txs.forEach((t) => {
      const m = t.month;
      if (!monthStats[m]) monthStats[m] = { income: 0, spent: 0 };
      monthStats[m].spent += Number(t.amount) || 0;
    });

    incs.forEach((i) => {
      const m = i.month;
      if (!monthStats[m]) monthStats[m] = { income: 0, spent: 0 };
      monthStats[m].income += Number(i.amount) || 0;
    });

    const months = Object.keys(monthStats).sort();
    let cumulative = 0;

    const result = months.map((month) => {
      const { income, spent } = monthStats[month];
      const net = income - spent;
      cumulative += net;
      return {
        month,
        income,
        spent,
        net,
        cumulativeNet: cumulative,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Net worth error:', err);
    res.status(500).json({ error: 'Failed to load net worth data' });
  }
});

module.exports = router;
