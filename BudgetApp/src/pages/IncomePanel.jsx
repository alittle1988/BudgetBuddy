// src/pages/IncomePanel.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

function IncomePanel({
  theme,
  accent,
  incomes,
  selectedMonth,
  onAddIncome,
  onDeleteIncome,
  onUpdateIncome,
}) {
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(`${selectedMonth}-01`.slice(0, 10));
  const [hoursWorked, setHoursWorked] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    category: 'Other',
    description: '',
    amount: '',
    date: `${selectedMonth}-01`.slice(0, 10),
    hoursWorked: '',
  });

  useEffect(() => {
    setDate(`${selectedMonth}-01`.slice(0, 10));
    setEditForm((prev) => ({ ...prev, date: `${selectedMonth}-01`.slice(0, 10) }));
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

  function startEditing(income) {
    setEditingId(income.id);
    setEditForm({
      category: income.category || 'Other',
      description: income.description || '',
      amount: income.amount,
      date: income.date,
      hoursWorked: income.category === 'Tips' ? income.hoursWorked || '' : '',
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm({
      category: 'Other',
      description: '',
      amount: '',
      date: `${selectedMonth}-01`.slice(0, 10),
      hoursWorked: '',
    });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingId) return;
    if (!editForm.amount) return;
    if (editForm.category === 'Tips' && !editForm.hoursWorked) return;

    await onUpdateIncome(editingId, {
      category: editForm.category,
      description: editForm.description,
      amount: editForm.amount,
      date: editForm.date,
      hoursWorked:
        editForm.category === 'Tips' ? editForm.hoursWorked : undefined,
    });
    cancelEditing();
  }

  const sortedIncomes = useMemo(() => {
    return [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomes]);

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
                      <th style={{ width: '15%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedIncomes.map((i) =>
                      editingId === i.id ? (
                        <tr key={i.id}>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  category: e.target.value,
                                  hoursWorked: e.target.value === 'Tips' ? prev.hoursWorked : '',
                                }))
                              }
                            >
                              <option value="Tips">Tips</option>
                              <option value="Checks">Checks</option>
                              <option value="Other">Other</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={editForm.date}
                              onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, date: e.target.value }))
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td>
                            {editForm.category === 'Tips' ? (
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={editForm.hoursWorked}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    hoursWorked: e.target.value,
                                  }))
                                }
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={editForm.amount}
                              onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, amount: e.target.value }))
                              }
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className={`btn btn-outline-${accent}`}
                                onClick={handleSaveEdit}
                                disabled={
                                  !editForm.amount ||
                                  (editForm.category === 'Tips' && !editForm.hoursWorked)
                                }
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr
                          key={i.id}
                          role="button"
                          style={{ cursor: 'pointer' }}
                          onClick={() => startEditing(i)}
                        >
                          <td>{i.category || 'Other'}</td>
                          <td>{i.date}</td>
                          <td>{i.description}</td>
                          <td>{i.category === 'Tips' ? (i.hoursWorked ?? '-') : '-'}</td>
                          <td>${Number(i.amount).toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteIncome(i.id);
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      )
                    )}
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
