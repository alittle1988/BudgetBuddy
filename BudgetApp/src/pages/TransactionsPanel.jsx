// src/pages/TransactionsPanel.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TransactionRow from '../components/TransactionRow';

function TransactionsPanel({
  theme,
  accent,
  categories,
  transactions,
  selectedMonth,
  userId,
  onAddTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}) {
  const filterStorageKey = userId ? `txFilter:${userId}` : 'txFilter';
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(
    `${selectedMonth}-01`.slice(0, 10) // default first of month
  );
  const [filterCategoryId, setFilterCategoryId] = useState(() => {
    try {
      return localStorage.getItem(filterStorageKey) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const savedFilter = (() => {
      try {
        return localStorage.getItem(filterStorageKey);
      } catch {
        return null;
      }
    })();

    setFilterCategoryId(savedFilter || '');
  }, [filterStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(filterStorageKey, filterCategoryId);
    } catch {
      // ignore write errors
    }
  }, [filterCategoryId, filterStorageKey]);

  useEffect(() => {
    setDate(`${selectedMonth}-01`.slice(0, 10));
  }, [selectedMonth]);

  useEffect(() => {
    if (!categories.length) return;
    if (filterCategoryId && !categories.some((c) => c.id === filterCategoryId)) {
      setFilterCategoryId('');
    }
  }, [categories, filterCategoryId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!categoryId || !amount) return;

    await onAddTransaction({
      categoryId,
      description,
      amount,
      date,
    });

    // Reset amount/description only
    setDescription('');
    setAmount('');
  }

  const filteredTransactions = filterCategoryId
    ? transactions.filter((t) => t.categoryId === filterCategoryId)
    : transactions;


  return (
    <div className="row mt-4 mb-5">
      <div className="col-md-10 mx-auto">
        <div
          className={`card ${
            theme === 'dark' ? 'bg-secondary text-light' : ''
          }`}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                  Expenses
                  <span className="badge bg-secondary">
                    {filteredTransactions.length}
                  </span>
                </h5>
                <small className="text-muted">
                  Manage your spending for the selected month.
                </small>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Link to="/" className="btn btn-sm btn-outline-secondary">
                  ⬅ Back to Dashboard
                </Link>

                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Filter by category:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ minWidth: 160 }}
                    value={filterCategoryId}
                    onChange={(e) => setFilterCategoryId(e.target.value)}
                  >
                    <option value="">All</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Add transaction form */}
            <form className="row g-3 mb-4" onSubmit={handleSubmit}>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Groceries"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="submit"
                  className={`btn btn-outline-${accent} w-100`}
                  disabled={!categoryId || !amount}
                >
                  Add
                </button>
              </div>
            </form>

            {/* Transactions list */}
            {filteredTransactions.length === 0 ? (
              <p className="text-muted mb-0">
                No transactions for this month yet.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th style={{ width: '15%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => (
                      <TransactionRow
                        key={t.id}
                        transaction={t}
                        categories={categories}
                        onUpdate={onUpdateTransaction}
                        onDelete={onDeleteTransaction}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPanel;
