// src/components/TransactionRow.jsx
import { useEffect, useState } from 'react';

function TransactionRow({ transaction, categories, onUpdate, onDelete, accent }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    categoryId: transaction.categoryId,
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
  });

  // Keep local state in sync if parent updates the transaction
  useEffect(() => {
    setForm({
      categoryId: transaction.categoryId,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
    });
  }, [transaction]);

  function categoryName(id) {
    return categories.find((c) => c.id === id)?.name || 'Unknown';
  }

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === 'amount'
          ? value
          : value, // keep as string; convert on save
    }));
  }

  async function handleSave() {
    if (!form.categoryId || !form.amount) return;

    await onUpdate(transaction.id, {
      categoryId: form.categoryId,
      description: form.description,
      amount: form.amount,
      date: form.date,
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setForm({
      categoryId: transaction.categoryId,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
    });
    setIsEditing(false);
  }

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="date"
            className="form-control form-control-sm"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        ) : (
          transaction.date
        )}
      </td>

      <td>
        {isEditing ? (
          <select
            className="form-select form-select-sm"
            value={form.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
          >
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          categoryName(transaction.categoryId)
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={form.description}
            onChange={(e) =>
              handleChange('description', e.target.value)
            }
          />
        ) : (
          transaction.description
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            min="0"
            step="0.01"
          />
        ) : (
          `$${Number(transaction.amount).toFixed(2)}`
        )}
      </td>

      <td>
        {isEditing ? (
          <div className="btn-group btn-group-sm">
            <button
              className={`btn btn-outline-${accent}`}
              onClick={handleSave}
              disabled={!form.categoryId || !form.amount}
            >
              Save
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="btn-group btn-group-sm">
            <button
              className={`btn btn-outline-${accent}`}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => onDelete(transaction.id)}
            >
              ✕
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default TransactionRow;
