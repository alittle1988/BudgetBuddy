// src/components/MonthFilterBar.jsx
function MonthFilterBar({ selectedMonth, onChangeMonth }) {
  return (
    <div className="row">
      <div className="col-md-4 ms-auto">
        <label className="form-label small mb-1">Month</label>
        <input
          type="month"
          className="form-control form-control-sm"
          value={selectedMonth}
          onChange={(e) => onChangeMonth(e.target.value)}
        />
      </div>
    </div>
  );
}

export default MonthFilterBar;
