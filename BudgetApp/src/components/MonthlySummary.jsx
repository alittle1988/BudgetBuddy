// src/components/MonthlySummary.jsx
function MonthlySummary({ theme, totals }) {
  return (
    <div
      className={`card mt-3 shadow-sm ${
        theme === "dark" ? "bg-secondary text-light" : ""
      }`}
    >
      <div className="card-body">
        <div className="row gy-3">
          <div className="col-sm-4">
            <div
              className={`p-3 border rounded ${
                theme === "dark" ? "bg-dark text-light border-light" : "bg-light"
              }`}
            >
              <div className="small text-muted">Income</div>
              <div className="fs-5 fw-semibold">
                ${totals.income.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div
              className={`p-3 border rounded ${
                theme === "dark" ? "bg-dark text-light border-light" : "bg-light"
              }`}
            >
              <div className="small text-muted">Expenses</div>
              <div className="fs-5 fw-semibold">
                ${totals.expense.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div
              className={`p-3 border rounded ${
                theme === "dark" ? "bg-dark text-light border-light" : "bg-light"
              }`}
            >
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
      </div>
    </div>
  );
}

export default MonthlySummary;
