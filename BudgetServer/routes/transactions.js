/* routes/transactions.js */
const express = require('express');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const { getCurrentMonth } = require('../utils/date');

const router = express.Router();

async function validateCategoryOwnership(userId, categoryId) {
  if (!categoryId) return false;
  const cat = await Category.findOne({ _id: categoryId, userId });
  return Boolean(cat);
}

// GET /api/transactions?month=YYYY-MM
router.get('/', async (req, res) => {
  try {
    const month = req.query.month || getCurrentMonth();
    const txs = await Transaction.find({
      userId: req.userId,
      month,
    }).sort({ date: -1, createdAt: -1 });

    res.json(
      txs.map((t) => ({
        id: t._id.toString(),
        userId: t.userId.toString(),
        categoryId: t.categoryId.toString(),
        description: t.description,
        amount: t.amount,
        date: t.date,
        month: t.month,
      }))
    );
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    let { categoryId, description, amount, date } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: 'categoryId is required' });
    }

    const isOwned = await validateCategoryOwnership(req.userId, categoryId);
    if (!isOwned) {
      return res.status(400).json({ error: 'Invalid category for this user' });
    }

    amount = Number(amount) || 0;

    if (!date) {
      const d = new Date();
      date = d.toISOString().slice(0, 10); // YYYY-MM-DD
    }

    const month = date.slice(0, 7);

    const tx = await Transaction.create({
      userId: req.userId,
      categoryId,
      description: (description || '').trim() || 'Transaction',
      amount,
      date,
      month,
    });

    res.status(201).json({
      id: tx._id.toString(),
      userId: tx.userId.toString(),
      categoryId: tx.categoryId.toString(),
      description: tx.description,
      amount: tx.amount,
      date: tx.date,
      month: tx.month,
    });
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { categoryId, description, amount, date } = req.body;

    const tx = await Transaction.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (categoryId !== undefined) {
      const isOwned = await validateCategoryOwnership(req.userId, categoryId);
      if (!isOwned) {
        return res.status(400).json({ error: 'Invalid category for this user' });
      }
      tx.categoryId = categoryId;
    }
    if (description !== undefined) tx.description = String(description);
    if (amount !== undefined) tx.amount = Number(amount);
    if (date !== undefined) {
      tx.date = date;
      tx.month = date.slice(0, 7);
    }

    await tx.save();

    res.json({
      id: tx._id.toString(),
      userId: tx.userId.toString(),
      categoryId: tx.categoryId.toString(),
      description: tx.description,
      amount: tx.amount,
      date: tx.date,
      month: tx.month,
    });
  } catch (err) {
    console.error('Update transaction error:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const tx = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
