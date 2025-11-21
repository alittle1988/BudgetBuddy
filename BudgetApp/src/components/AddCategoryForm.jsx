// src/components/AddCategoryForm.jsx
function AddCategoryForm({
  theme,
  accent,
  newName,
  newBudget,
  onChangeName,
  onChangeBudget,
  onSubmit,
}) {
  const isDark = theme === 'dark';

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="addCategoryModal"
        tabIndex="-1"
        aria-labelledby="addCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className={`modal-content ${
              isDark ? 'bg-dark text-light' : ''
            }`}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="addCategoryModalLabel">
                Add Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Form lives inside the modal */}
            <form
              onSubmit={(e) => {
                onSubmit(e);
                // Let Bootstrap close the modal via data-bs-dismiss on submit button
              }}
            >
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newName}
                    onChange={(e) => onChangeName(e.target.value)}
                    placeholder="e.g. Utilities"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Budget</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newBudget}
                    onChange={(e) => onChangeBudget(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-${accent}`}
                  data-bs-dismiss="modal"
                  disabled={!newName.trim()}
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCategoryForm;
