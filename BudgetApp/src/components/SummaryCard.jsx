// src/components/SummaryCard.jsx
function SummaryCard({
  theme,
  categories,
  totalBudget,
  totalSpent,
  totalIncome,
  remaining, // budget - spent
}) {
  const percent =
    totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  const net = totalIncome - totalSpent;

  return (
    <div className="row mb-4 mt-3">
      <div className="col-md-10 mx-auto">
        <div
          className={`card ${
            theme === 'dark' ? 'bg-secondary text-light' : ''
          }`}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">Summary</h5>
              <small className="text-muted">
                Categories: {categories.length}
              </small>
            </div>

            <div className="row text-center mb-3">
              <div className="col-md-3 mb-2 mb-md-0">
                <div className="fw-semibold">Total Income</div>
                <div>${totalIncome.toFixed(2)}</div>
              </div>
              <div className="col-md-3 mb-2 mb-md-0">
                <div className="fw-semibold">Total Budget</div>
                <div>${totalBudget.toFixed(2)}</div>
              </div>
              <div className="col-md-3 mb-2 mb-md-0">
                <div className="fw-semibold">Total Spent</div>
                <div>${totalSpent.toFixed(2)}</div>
              </div>
              <div className="col-md-3">
                <div className="fw-semibold">Net (Income - Spent)</div>
                <div
                  className={
                    net < 0 ? 'text-danger fw-bold' : 'fw-bold text-success'
                  }
                >
                  ${net.toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between mb-1">
                <small>Spending vs Budget</small>
                <small>{percent.toFixed(1)}%</small>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className={`progress-bar ${
                    remaining < 0 ? 'bg-danger' : 'bg-success'
                  }`}
                  role="progressbar"
                  style={{ width: `${percent}%` }}
                  aria-valuenow={totalSpent}
                  aria-valuemin="0"
                  aria-valuemax={totalBudget || 1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
