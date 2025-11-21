import CategoryRow from './CategoryRow';

function CategoriesTable({
  theme,
  accent,
  categories,
  loading,
  spentByCategory,
  onLocalChange,
  onSave,
  onDelete,
}) {
  return (
    <div className="row">
      <div className="col-md-10 mx-auto">
        <div
          className={`card ${
            theme === 'dark' ? 'bg-secondary text-light' : ''
          }`}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Categories</h5>
              {loading && <span className="small text-muted">Loading…</span>}
            </div>

            {categories.length === 0 && !loading ? (
              <p className="text-muted mb-0">
                No categories yet. Add your first one below.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th style={{ width: '15%' }}>Budget</th>
                      <th style={{ width: '15%' }}>Spent</th>
                      <th style={{ width: '15%' }}>Remaining</th>
                      <th style={{ width: '20%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <CategoryRow
                        key={cat.id}
                        accent={accent}
                        category={cat}
                        spent={spentByCategory[cat.id] || 0}
                        onLocalChange={onLocalChange}
                        onSave={onSave}
                        onDelete={onDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className={`btn btn-${accent}`}
                data-bs-toggle="modal"
                data-bs-target="#addCategoryModal"
              >
                + Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesTable;
