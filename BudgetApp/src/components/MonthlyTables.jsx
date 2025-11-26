// src/components/MonthlyTables.jsx
import { useMemo, useState } from "react";

function MonthlyTables({ theme, transactions, incomes }) {
  const [expenseFilter, setExpenseFilter] = useState("");
  const [incomeFilter, setIncomeFilter] = useState("");

  const formatMoney = (val) => `$${Number(val || 0).toFixed(2)}`;
  const tableClass = "table table-sm align-middle";

  const filteredExpenses = useMemo(() => {
    if (!expenseFilter) return transactions;
    return transactions.filter(
      (t) => (t.categoryName || "Uncategorized") === expenseFilter
    );
  }, [transactions, expenseFilter]);

  const filteredIncomes = useMemo(() => {
    if (!incomeFilter) return incomes;
    return incomes.filter((i) => (i.category || "Other") === incomeFilter);
  }, [incomes, incomeFilter]);

  const expenseCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => set.add(t.categoryName || "Uncategorized"));
    return Array.from(set);
  }, [transactions]);

  const incomeCategories = useMemo(() => {
    const set = new Set();
    incomes.forEach((i) => set.add(i.category || "Other"));
    return Array.from(set);
  }, [incomes]);

  return (
    <div
      className={`card mt-3 shadow-sm ${
        theme === "dark" ? "bg-secondary text-light" : ""
      }`}
    >
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="d-flex align-items-center gap-2 mb-0">
                Expenses
                <span className="badge bg-secondary">{filteredExpenses.length}</span>
              </h6>
              <select
                className="form-select form-select-sm"
                style={{ maxWidth: 180 }}
                value={expenseFilter}
                onChange={(e) => setExpenseFilter(e.target.value)}
              >
                <option value="">All categories</option>
                {expenseCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {filteredExpenses.length === 0 ? (
              <p className="text-muted small mb-0">No expenses recorded.</p>
            ) : (
              <div className="table-responsive">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((t) => (
                      <tr key={t.id}>
                        <td className="text-nowrap">{t.date}</td>
                        <td>{t.categoryName || "Uncategorized"}</td>
                        <td>{t.description || "Expense"}</td>
                        <td className="text-end">{formatMoney(t.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="d-flex align-items-center gap-2 mb-0">
                Income
                <span className="badge bg-secondary">{filteredIncomes.length}</span>
              </h6>
              <select
                className="form-select form-select-sm"
                style={{ maxWidth: 180 }}
                value={incomeFilter}
                onChange={(e) => setIncomeFilter(e.target.value)}
              >
                <option value="">All categories</option>
                {incomeCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {filteredIncomes.length === 0 ? (
              <p className="text-muted small mb-0">No income recorded.</p>
            ) : (
              <div className="table-responsive">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncomes.map((i) => (
                      <tr key={i.id}>
                        <td className="text-nowrap">{i.date}</td>
                        <td>{i.category || "Other"}</td>
                        <td>{i.description || "Income"}</td>
                        <td className="text-end">{formatMoney(i.amount)}</td>
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

export default MonthlyTables;
