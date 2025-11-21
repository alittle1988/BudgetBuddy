// src/components/NetWorthChart.jsx
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function formatMonthLabel(monthStr) {
  // '2025-03' -> 'Mar 2025'
  const [year, month] = monthStr.split('-').map(Number);
  if (!year || !month) return monthStr;
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

function NetWorthChart({ theme, data, loading }) {
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay render until after mount so ResponsiveContainer can measure layout
    setMounted(true);
  }, []);

  return (
    <div className="row my-4">
      <div className="col-md-10 mx-auto">
        <div
          className={`card ${
            isDark ? 'bg-secondary text-light' : ''
          }`}
        >
          <div className="card-body">
            <h5 className="card-title mb-1">Net Worth Over Time</h5>
            <p className="text-muted small mb-3">
              Cumulative net worth based on income minus spending each month.
            </p>

            {loading ? (
              <p className="text-muted mb-0">Loading chart…</p>
            ) : !data || data.length === 0 ? (
              <p className="text-muted mb-0">
                Not enough data yet to show the chart. Add some income and transactions.
              </p>
            ) : !mounted ? (
              <p className="text-muted mb-0">Preparing chart…</p>
            ) : (
              <div style={{ width: '100%', minHeight: 320 }}>
                <ResponsiveContainer width="100%" height={320} minHeight={320}>
                  <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonthLabel}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => formatMonthLabel(value)}
                      formatter={(value, name) => [
                        `$${Number(value).toFixed(2)}`,
                        name === 'cumulativeNet'
                          ? 'Cumulative Net Worth'
                          : name === 'net'
                          ? 'Monthly Net'
                          : name.charAt(0).toUpperCase() + name.slice(1),
                      ]}
                    />
                    <Legend />
                    {/* Monthly net line */}
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Monthly Net"
                    />
                    {/* Cumulative net worth line */}
                    <Line
                      type="monotone"
                      dataKey="cumulativeNet"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Cumulative Net Worth"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetWorthChart;
