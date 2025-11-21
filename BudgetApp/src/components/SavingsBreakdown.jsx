// src/components/SavingsBreakdown.jsx
function SavingsBreakdown({ theme, netIncome }) {
  const mainSavings = netIncome * 0.8;
  const goalSavings = netIncome * 0.2;
  const sideSavings = netIncome * 0.2;

  const textClass = (value) =>
    value >= 0 ? "text-success fw-semibold" : "text-danger fw-semibold";

  const formatMoney = (value) => `$${value.toFixed(2)}`;

  return (
    <div className="row my-4">
      <div className="col-md-10 mx-auto">
        <div
          className={`card ${
            theme === "dark" ? "bg-secondary text-light" : ""
          }`}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Post-Expense Savings Plan</h5>
              <small className="text-muted">
                Based on net income after expenses
              </small>
            </div>

            <div className="row gy-3">
              <div className="col-md-4">
                <div className="p-3 border rounded h-100 bg-light">
                  <div className="small text-muted">Main Savings (80%)</div>
                  <div className={textClass(mainSavings)}>
                    {formatMoney(mainSavings)}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded h-100 bg-light">
                  <div className="small text-muted">Goal Savings (20%)</div>
                  <div className={textClass(goalSavings)}>
                    {formatMoney(goalSavings)}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded h-100 bg-light">
                  <div className="small text-muted">Side Savings (20%)</div>
                  <div className={textClass(sideSavings)}>
                    {formatMoney(sideSavings)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavingsBreakdown;
