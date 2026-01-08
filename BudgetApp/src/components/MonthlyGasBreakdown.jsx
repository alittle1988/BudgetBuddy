// src/components/MonthlyGasBreakdown.jsx
import { useMemo } from "react";

function MonthlyGasBreakdown({ transactions }) {
  const gasStats = useMemo(() => {
    const gasTx = (transactions || []).filter((t) =>
      (t.categoryName || "").toLowerCase() === "gas"
    );
    const total = gasTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const gallons = gasTx.reduce(
      (sum, t) => sum + Number(t.description || 0),
      0
    );
    const count = gasTx.length;
    const dollarPerGallon = gallons ? total / gallons : 0;
    return { total, gallons, count, dollarPerGallon };
  }, [transactions]);

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-body">
        <h6 className="mb-3">Gas Breakdown</h6>
        <div className="row gy-2">
          <div className="col-sm-4">
            <div className="p-3 border rounded bg-light">
              <div className="small text-muted">Total Dollars Spent</div>
              <div className="fs-6 fw-semibold">
                ${gasStats.total.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="p-3 border rounded bg-light">
              <div className="small text-muted">Gallons</div>
              <div className="fs-6 fw-semibold">{gasStats.gallons.toFixed(3)}</div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="p-3 border rounded bg-light">
              <div className="small text-muted">Dollar per Gallon</div>
              <div className="fs-6 fw-semibold">
                ${gasStats.dollarPerGallon.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyGasBreakdown;
