// server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');
const Income = require('./models/Income');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/budgetbuddy';

// ----- Helper for month strings -----
function getMonthStrings() {
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7); // YYYY-MM

  const prev = new Date(now);
  prev.setMonth(prev.getMonth() - 1);
  const prevMonth = prev.toISOString().slice(0, 7);

  return { thisMonth, prevMonth };
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB (seed)');

  const { thisMonth, prevMonth } = getMonthStrings();

  const demoEmail = 'demo@example.com';
  const demoPassword = 'DemoPass123!'; // you'll use this to log in

  // ----- Create or find demo user -----
  let user = await User.findOne({ email: demoEmail });
  if (!user) {
    const passwordHash = await bcrypt.hash(demoPassword, 10);
    user = await User.create({
      email: demoEmail,
      passwordHash,
      name: 'Demo User',
    });
    console.log(`👤 Created demo user: ${demoEmail} / ${demoPassword}`);
  } else {
    console.log(`👤 Demo user already exists: ${demoEmail}`);
  }

  // Optional: clear existing data for this user before seeding
  await Category.deleteMany({ userId: user._id });
  await Transaction.deleteMany({ userId: user._id });
  await Income.deleteMany({ userId: user._id });

  console.log('🧹 Cleared existing categories, transactions, incomes for demo user');

  // ----- Seed categories (reused for all months) -----
  const baseCategories = [
    { name: 'Rent / Mortgage', budget: 1500 },
    { name: 'Groceries', budget: 400 },
    { name: 'Transportation', budget: 200 },
    { name: 'Entertainment', budget: 150 },
    { name: 'Utilities', budget: 250 },
    { name: 'Dining Out', budget: 180 },
    { name: 'Health', budget: 120 },
  ];

  // Insert categories for the current month only (used to attach budgets);
  // transactions will reference category IDs regardless of month.
  const categories = await Category.insertMany(
    baseCategories.map((c) => ({
      userId: user._id,
      name: c.name,
      budget: c.budget,
      month: thisMonth,
    }))
  );

  const catByName = Object.fromEntries(
    categories.map((c) => [c.name, c])
  );

  console.log('📁 Seeded categories for current month');

  // ----- Build year of data -----
  const year = new Date().getFullYear();

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const months = Array.from({ length: 12 }, (_, idx) =>
    `${year}-${String(idx + 1).padStart(2, '0')}`
  );

  const allIncomes = [];
  const allTxs = [];

  months.forEach((month) => {
    for (let i = 0; i < 5; i += 1) {
      allIncomes.push({
        userId: user._id,
        description:
          i === 0
            ? 'Salary'
            : i === 1
            ? 'Bonus'
            : `Side Gig ${i}`,
        amount: Number(randomInRange(500, 4500).toFixed(2)),
        date: `${month}-${String(randChoice([1, 5, 10, 15, 20, 25])).padStart(2, '0')}`,
        month,
      });
    }

    const categoryNames = baseCategories.map((c) => c.name);
    for (let i = 0; i < 15; i += 1) {
      const category = randChoice(categoryNames);
      const cat = catByName[category];
      if (!cat) continue;
      allTxs.push({
        userId: user._id,
        categoryId: cat._id,
        description: `${category} expense ${i + 1}`,
        amount: Number(randomInRange(10, 300).toFixed(2)),
        date: `${month}-${String(randChoice([2, 6, 9, 12, 18, 22, 27])).padStart(2, '0')}`,
        month,
      });
    }
  });

  await Income.insertMany(allIncomes);
  console.log(`💰 Seeded incomes (${allIncomes.length} entries across 12 months)`);

  await Transaction.insertMany(allTxs);
  console.log(`🧾 Seeded transactions (${allTxs.length} entries across 12 months)`);

  await mongoose.disconnect();
  console.log('✅ Seed completed, disconnected from MongoDB');
}

run().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
