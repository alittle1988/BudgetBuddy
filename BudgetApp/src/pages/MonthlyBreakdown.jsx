// src/pages/MonthlyBreakdown.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTransactions } from "../api/transactions";
import { fetchIncomes } from "../api/incomes";
import { fetchCategories, fetchAllCategories } from "../api/categories";
import MonthlySummary from "../components/MonthlySummary";
import MonthlyCategoryBreakdown from "../components/MonthlyCategoryBreakdown";
import MonthlyGasBreakdown from "../components/MonthlyGasBreakdown";
import MonthlyTables from "../components/MonthlyTables";

function MonthlyBreakdown({ theme }) {
  const { year, month } = useParams();
  const normalizedMonth = (month || "01").padStart(2, "0");
  const normalizedYear =
    year || new Date().getFullYear().toString();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const monthKey = `${normalizedYear}-${normalizedMonth}`;

  const monthName = useMemo(() => {
    const date = new Date(`${normalizedYear}-${normalizedMonth}-01T00:00:00`);
    if (Number.isNaN(date.getTime())) return `${normalizedYear}-${normalizedMonth}`;
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  }, [normalizedMonth, normalizedYear]);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetchTransactions(monthKey),
      fetchIncomes(monthKey),
      fetchCategories(monthKey),
      fetchAllCategories(),
    ])
      .then(([txs, incs, cats, allCats]) => {
        setTransactions(txs);
        setIncomes(incs);
        setCategories(cats);
        setAllCategories(allCats);
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

  const expenseByCategory = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = t.categoryId || t.categoryName || "Uncategorized";
      const displayName = t.categoryName || "Uncategorized";
      if (!map[key]) map[key] = { amount: 0, name: displayName, categoryId: t.categoryId };
      map[key].amount += Number(t.amount || 0);
    });
    return Object.values(map).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const incomeByCategory = useMemo(() => {
    const map = {};
    incomes.forEach((i) => {
      const key = i.category || 'Other';
      map[key] = (map[key] || 0) + Number(i.amount || 0);
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({ name, amount }));
  }, [incomes]);

  return (
    <div className="row mt-4 mb-5">
      <div className="col-lg-10 mx-auto">
        <div
          className={`card shadow-sm ${
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
                <Link
                  to="/yearly"
                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                >
                  <span aria-hidden="true">←</span>
                  <span>Yearly</span>
                </Link>
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
                  aria-label="Loading monthly data"
                ></div>
              </div>
            ) : (
              <>
                <MonthlySummary theme={theme} totals={totals} />
                <MonthlyCategoryBreakdown
                  expenseByCategory={expenseByCategory}
                  incomeByCategory={incomeByCategory}
                  categories={allCategories.length ? allCategories : categories}
                />
                <MonthlyGasBreakdown transactions={transactions} />
                <MonthlyTables
                  theme={theme}
                  transactions={transactions}
                  incomes={incomes}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyBreakdown;
