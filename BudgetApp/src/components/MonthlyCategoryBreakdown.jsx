// src/components/MonthlyCategoryBreakdown.jsx
import { useMemo, useState } from "react";

function CategoryTable({ title, data, categories }) {
  const budgetById = useMemo(() => {
    const map = {};
    (categories || []).forEach((c) => {
      map[c.id] = Number(c.budget || 0);
    });
    return map;
  }, [categories]);

  const budgetByName = useMemo(() => {
    const map = {};
    (categories || []).forEach((c) => {
      map[c.name] = Number(c.budget || 0);
    });
    return map;
  }, [categories]);

  const resolveBudget = (row) => {
    if (row.categoryId && budgetById[row.categoryId] !== undefined) {
      return budgetById[row.categoryId];
    }
    if (budgetByName[row.name] !== undefined) {
      return budgetByName[row.name];
    }
    return 0;
  };

  return data.length === 0 ? (
    <p className="text-muted small mb-0">No {title.toLowerCase()} recorded.</p>
  ) : (
    <div className="table-responsive">
      <table className="table table-sm align-middle mb-0">
        <thead>
          <tr>
            <th>Category</th>
            {title === "Expenses" && <th className="text-end">Budget</th>}
            {title === "Expenses" && <th className="text-end">Diff</th>}
            <th className="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              {title === "Expenses" && (
                <>
                  <td className="text-end">
                    ${Number(resolveBudget(row)).toFixed(2)}
                  </td>
                  <td
                    className={`text-end ${
                      resolveBudget(row) - Number(row.amount || 0) < 0
                        ? "text-danger fw-semibold"
                        : ""
                    }`}
                  >
                    ${Number(resolveBudget(row) - Number(row.amount || 0)).toFixed(2)}
                  </td>
                </>
              )}
              <td className="text-end">
                ${Number(row.amount || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MonthlyCategoryBreakdown({ expenseByCategory, incomeByCategory, categories }) {
  const [showExpenses, setShowExpenses] = useState(false);
  const [showIncome, setShowIncome] = useState(false);

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row gap-3 mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg flex-fill"
            onClick={() => setShowExpenses((s) => !s)}
          >
            {showExpenses ? "Hide" : "Show"} Expenses by Category
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg flex-fill"
            onClick={() => setShowIncome((s) => !s)}
          >
            {showIncome ? "Hide" : "Show"} Income by Category
          </button>
        </div>

        <div className="d-flex flex-column gap-3">
          {showExpenses && (
            <div className="mt-1">
              <CategoryTable title="Expenses" data={expenseByCategory} categories={categories} />
            </div>
          )}
          {showIncome && (
            <div className="mt-1">
              <CategoryTable title="Income" data={incomeByCategory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyCategoryBreakdown;
