/* routes/incomes.js */
const express = require('express');
const Income = require('../models/Income');
const { getCurrentMonth } = require('../utils/date');

const ALLOWED_CATEGORIES = ['Tips', 'Checks', 'Other'];

const router = express.Router();

// GET /api/incomes?month=YYYY-MM
router.get('/', async (req, res) => {
  try {
    const month = req.query.month || getCurrentMonth();
    const incs = await Income.find({
      userId: req.userId,
      month,
    }).sort({ date: -1, createdAt: -1 });

    res.json(
      incs.map((i) => ({
        id: i._id.toString(),
        userId: i.userId.toString(),
        description: i.description,
        amount: i.amount,
        category: i.category || 'Other',
        hoursWorked: i.hoursWorked ?? null,
        date: i.date,
        month: i.month,
      }))
    );
  } catch (err) {
    console.error('Get incomes error:', err);
    res.status(500).json({ error: 'Failed to load incomes' });
  }
});

// POST /api/incomes
router.post('/', async (req, res) => {
  try {
    let { description, amount, date, category, hoursWorked } = req.body;

    amount = Number(amount) || 0;

    if (!date) {
      const d = new Date();
      date = d.toISOString().slice(0, 10); // YYYY-MM-DD
    }

    const month = date.slice(0, 7);
    const cat = ALLOWED_CATEGORIES.includes(category) ? category : 'Other';
    const hours =
      cat === 'Tips' && hoursWorked !== undefined
        ? Number(hoursWorked) || 0
        : null;

    const inc = await Income.create({
      userId: req.userId,
      description: (description || '').trim() || 'Income',
      amount,
      category: cat,
      hoursWorked: hours,
      date,
      month,
    });

    res.status(201).json({
      id: inc._id.toString(),
      userId: inc.userId.toString(),
      description: inc.description,
      amount: inc.amount,
      category: inc.category,
      hoursWorked: inc.hoursWorked,
      date: inc.date,
      month: inc.month,
    });
  } catch (err) {
    console.error('Create income error:', err);
    res.status(500).json({ error: 'Failed to create income' });
  }
});

// DELETE /api/incomes/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const inc = await Income.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!inc) {
      return res.status(404).json({ error: 'Income not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete income error:', err);
    res.status(500).json({ error: 'Failed to delete income' });
  }
});

module.exports = router;
