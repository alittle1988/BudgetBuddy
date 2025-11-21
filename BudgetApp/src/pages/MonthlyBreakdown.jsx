// src/pages/MonthlyBreakdown.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTransactions } from "../api/transactions";
import { fetchIncomes } from "../api/incomes";

function MonthlyBreakdown({ theme }) {
  const { year, month } = useParams();
  const normalizedMonth = (month || "01").padStart(2, "0");
  const normalizedYear =
    year || new Date().getFullYear().toString();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const monthKey = `${normalizedYear}-${normalizedMonth}`;

  const monthName = useMemo(() => {
    const date = new Date(`${normalizedYear}-${normalizedMonth}-01T00:00:00`);
    if (Number.isNaN(date.getTime())) return `${normalizedYear}-${normalizedMonth}`;
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  }, [normalizedMonth, normalizedYear]);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([fetchTransactions(monthKey), fetchIncomes(monthKey)])
      .then(([txs, incs]) => {
        setTransactions(txs);
        setIncomes(incs);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load monthly breakdown");
      })
      .finally(() => setLoading(false));
  }, [monthKey]);

  const totals = useMemo(() => {
    const income = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const expense = transactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    return {
      income,
      expense,
      net: income - expense,
    };
  }, [transactions, incomes]);

  return (
    <div className="row mt-4 mb-5">
      <div className="col-lg-10 mx-auto">
        <div
          className={`card ${
            theme === "dark" ? "bg-secondary text-light" : ""
          }`}
        >
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="card-title mb-0">Monthly Breakdown</h5>
                <small className="text-muted">Details for {monthName}</small>
              </div>
              <div className="d-flex gap-2">
                <Link to="/yearly" className="btn btn-sm btn-outline-secondary">
                  ⬅ Back to Yearly
                </Link>
                <Link to="/" className="btn btn-sm btn-outline-secondary">
                  Dashboard
                </Link>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border"
                  role="status"
                  aria-label="Loading monthly data"
                ></div>
              </div>
            ) : (
              <>
                <div className="row gy-3 mb-4">
                  <div className="col-sm-4">
                    <div className="p-3 border rounded bg-light">
                      <div className="small text-muted">Income</div>
                      <div className="fs-5 fw-semibold">
                        ${totals.income.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-3 border rounded bg-light">
                      <div className="small text-muted">Expenses</div>
                      <div className="fs-5 fw-semibold">
                        ${totals.expense.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-3 border rounded bg-light">
                      <div className="small text-muted">Net</div>
                      <div
                        className={`fs-5 fw-semibold ${
                          totals.net >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        ${totals.net.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <h6>Expenses</h6>
                    {transactions.length === 0 ? (
                      <p className="text-muted small">No expenses recorded.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((t) => (
                              <tr key={t.id}>
                                <td>{t.date}</td>
                                <td>{t.description || "Expense"}</td>
                                <td>${Number(t.amount || 0).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <h6>Income</h6>
                    {incomes.length === 0 ? (
                      <p className="text-muted small">No income recorded.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incomes.map((i) => (
                              <tr key={i.id}>
                                <td>{i.date}</td>
                                <td>{i.description || "Income"}</td>
                                <td>${Number(i.amount || 0).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyBreakdown;
