// src/components/MonthlyGasBreakdown.jsx
import { useMemo } from "react";

function MonthlyGasBreakdown({ transactions }) {
  const gasStats = useMemo(() => {
    const gasTx = (transactions || []).filter((t) =>
      (t.categoryName || "").toLowerCase() === "gas"
    );
    const total = gasTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const count = gasTx.length;
    const average = count ? total / count : 0;
    return { total, count, average };
  }, [transactions]);

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-body">
        <h6 className="mb-3">Gas Breakdown</h6>
        <div className="row gy-2">
          <div className="col-sm-4">
            <div className="p-3 border rounded bg-light">
              <div className="small text-muted">Total Gas Spend</div>
              <div className="fs-6 fw-semibold">
                ${gasStats.total.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="p-3 border rounded bg-light">
              <div className="small text-muted">Gas Transactions</div>
              <div className="fs-6 fw-semibold">{gasStats.count}</div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="p-3 border rounded bg-light">
              <div className="small text-muted">Avg per Gas Transaction</div>
              <div className="fs-6 fw-semibold">
                ${gasStats.average.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyGasBreakdown;
