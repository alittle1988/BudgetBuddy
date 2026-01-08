/* routes/categories.js */
const express = require('express');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const { getCurrentMonth } = require('../utils/date');

const router = express.Router();

// GET /api/categories?month=YYYY-MM or /api/categories?all=true
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    if (all === 'true') {
      const cats = await Category.find({ userId: req.userId }).sort({ createdAt: -1 });
      const byName = new Map();
      cats.forEach((c) => {
        if (!byName.has(c.name)) {
          byName.set(c.name, {
            id: c._id.toString(),
            userId: c.userId.toString(),
            name: c.name,
            budget: c.budget,
            month: c.month,
          });
        }
      });
      return res.json(Array.from(byName.values()));
    }

    const month = req.query.month || getCurrentMonth();
    const cats = await Category.find({
      userId: req.userId,
      month,
    }).sort({ createdAt: 1 });

    res.json(
      cats.map((c) => ({
        id: c._id.toString(),
        userId: c.userId.toString(),
        name: c.name,
        budget: c.budget,
        month: c.month,
      }))
    );
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    let { name, budget, month } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    month = month || getCurrentMonth();

    const cat = await Category.create({
      userId: req.userId,
      name: name.trim(),
      budget: Number(budget) || 0,
      month,
    });

    res.status(201).json({
      id: cat._id.toString(),
      userId: cat.userId.toString(),
      name: cat.name,
      budget: cat.budget,
      month: cat.month,
    });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, budget } = req.body;
    const id = req.params.id;

    const cat = await Category.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (name !== undefined) cat.name = String(name);
    if (budget !== undefined) cat.budget = Number(budget);

    await cat.save();

    res.json({
      id: cat._id.toString(),
      userId: cat.userId.toString(),
      name: cat.name,
      budget: cat.budget,
      month: cat.month,
    });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const cat = await Category.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Also delete this user's transactions with that category
    await Transaction.deleteMany({
      userId: req.userId,
      categoryId: id,
    });

    res.status(204).send();
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
