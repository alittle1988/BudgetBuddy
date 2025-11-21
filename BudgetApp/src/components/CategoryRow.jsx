function CategoryRow({ accent, category, spent, onLocalChange, onSave, onDelete }) {
  const remaining = (category.budget || 0) - (spent || 0);
  const over = remaining < 0;

  return (
    <tr>
      <td>
        <input
          type="text"
          className="form-control form-control-sm"
          value={category.name}
          onChange={(e) =>
            onLocalChange(category.id, 'name', e.target.value)
          }
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control form-control-sm"
          value={category.budget}
          onChange={(e) =>
            onLocalChange(category.id, 'budget', e.target.value)
          }
          min="0"
          step="0.01"
        />
      </td>
      <td>${spent.toFixed(2)}</td>
      <td className={over ? 'text-danger fw-semibold' : ''}>
        ${remaining.toFixed(2)}
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <button
            className={`btn btn-outline-${accent}`}
            onClick={() => onSave(category)}
          >
            Save
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => onDelete(category.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default CategoryRow;
