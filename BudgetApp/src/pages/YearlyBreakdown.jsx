// src/pages/YearlyBreakdown.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchTransactions } from "../api/transactions";
import { fetchIncomes } from "../api/incomes";

function YearlyBreakdown({ theme, accent, user }) {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [year, setYear] = useState(currentYear.toString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  useEffect(() => {
    if (!user) return;

    const targetYear = Number(year) || currentYear;
    setLoading(true);
    setError("");

    Promise.all(
      months.map((_, idx) => {
        const monthKey = `${targetYear}-${String(idx + 1).padStart(2, "0")}`;
        return Promise.all([
          fetchTransactions(monthKey),
          fetchIncomes(monthKey),
        ]).then(([txs, incs]) => {
          const incomeTotal = incs.reduce(
            (sum, i) => sum + Number(i.amount || 0),
            0
          );
          const expenseTotal = txs.reduce(
            (sum, t) => sum + Number(t.amount || 0),
            0
          );
          return {
            monthKey,
            monthLabel: months[idx],
            incomeTotal,
            expenseTotal,
            net: incomeTotal - expenseTotal,
          };
        });
      })
    )
      .then(setRows)
      .catch((err) => {
        console.error(err);
        setError("Failed to load yearly breakdown");
      })
      .finally(() => setLoading(false));
  }, [year, user, months, currentYear]);

  const yearlyTotals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          acc.income += row.incomeTotal;
          acc.expense += row.expenseTotal;
          return acc;
        },
        { income: 0, expense: 0 }
      ),
    [rows]
  );
  const resolvedYear = Number(year) || currentYear;

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
                <h5 className="card-title mb-0">Yearly Breakdown</h5>
                <small className="text-muted">
                  Income and expenses by month for the selected year.
                </small>
              </div>

              <div className="d-flex align-items-center gap-2">
                <label className="form-label small mb-0">Year</label>
                <input
                  type="number"
                  min="2000"
                  className="form-control form-control-sm"
                  style={{ width: 110 }}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
                <Link
                  to="/"
                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                >
                  <span aria-hidden="true">←</span>
                  <span>Dashboard</span>
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
                  aria-label="Loading monthly totals"
                ></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.monthKey}
                        role="button"
                        style={{ cursor: "pointer" }}
                        tabIndex={0}
                        onClick={() =>
                          navigate(
                            `/yearly/${resolvedYear}/${row.monthKey.split("-")[1]}`
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(
                              `/yearly/${resolvedYear}/${row.monthKey.split("-")[1]}`
                            );
                          }
                        }}
                      >
                        <td className="text-decoration-underline">
                          {row.monthLabel}
                        </td>
                        <td>${row.incomeTotal.toFixed(2)}</td>
                        <td>${row.expenseTotal.toFixed(2)}</td>
                        <td
                          className={
                            row.net >= 0 ? "text-success fw-semibold" : "text-danger fw-semibold"
                          }
                        >
                          ${row.net.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="fw-semibold">
                      <td>Total</td>
                      <td>${yearlyTotals.income.toFixed(2)}</td>
                      <td>${yearlyTotals.expense.toFixed(2)}</td>
                      <td
                        className={
                          yearlyTotals.income - yearlyTotals.expense >= 0
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        ${(yearlyTotals.income - yearlyTotals.expense).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default YearlyBreakdown;
