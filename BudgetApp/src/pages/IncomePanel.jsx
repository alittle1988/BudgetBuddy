// src/pages/IncomePanel.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function IncomePanel({
  theme,
  accent,
  incomes,
  selectedMonth,
  onAddIncome,
  onDeleteIncome,
}) {
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(`${selectedMonth}-01`.slice(0, 10));
  const [hoursWorked, setHoursWorked] = useState('');

  useEffect(() => {
    setDate(`${selectedMonth}-01`.slice(0, 10));
  }, [selectedMonth]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    if (category === 'Tips' && !hoursWorked) return;

    await onAddIncome({
      description,
      amount,
      date,
      category,
      hoursWorked: category === 'Tips' ? hoursWorked : undefined,
    });

    setDescription('');
    setAmount('');
    setHoursWorked('');
  }

  return (
    <div className="row mt-4 mb-5">
      <div className="col-md-8 mx-auto">
        <div
          className={`card ${
            theme === 'dark' ? 'bg-secondary text-light' : ''
          }`}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                  Income
                  <span className="badge bg-secondary">{incomes.length}</span>
                </h5>
                <small className="text-muted">
                  Track your income for the selected month.
                </small>
              </div>
              <Link to="/" className="btn btn-sm btn-outline-secondary">
                ⬅ Back to Dashboard
              </Link>
            </div>

            {/* Add income form */}
            <form className="row g-3 mb-4" onSubmit={handleSubmit}>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setHoursWorked('');
                  }}
                >
                  <option value="Tips">Tips</option>
                  <option value="Checks">Checks</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Paycheck"
                />
              </div>
              <div className="col-md-3">
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
              {category === 'Tips' && (
                <div className="col-md-2">
                  <label className="form-label">Hours</label>
                  <input
                    type="number"
                    className="form-control"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
              )}
              <div className="col-md-3">
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
                  disabled={!amount || (category === 'Tips' && !hoursWorked)}
                >
                  Add
                </button>
              </div>
            </form>

            {/* Income list */}
            {incomes.length === 0 ? (
              <p className="text-muted mb-0">
                No income recorded for this month yet.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Hours</th>
                      <th>Amount</th>
                      <th style={{ width: '10%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((i) => (
                      <tr key={i.id}>
                        <td>{i.category || 'Other'}</td>
                        <td>{i.date}</td>
                        <td>{i.description}</td>
                        <td>{i.category === 'Tips' ? (i.hoursWorked ?? '-') : '-'}</td>
                        <td>${Number(i.amount).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDeleteIncome(i.id)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
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

export default IncomePanel;
