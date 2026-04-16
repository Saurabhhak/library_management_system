import styles from "./Category.module.css";

function CategoryForm({
  title,
  form,
  errors,
  loading,
  isEdit,
  handleChange,
  handleSubmit,
  handleReset,
  handleCancel,
}) {
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* TITLE */}
        <header className={styles.formTitle}>
          <i className={`fa-solid fa-layer-group ${styles.titleIcon}`} />
          <h2>{title}</h2>
        </header>

        {/* NAME */}
        <div className={styles.field}>
          <label className={styles.label}>
            Category Name <span>*</span>
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Computer / IT"
            maxLength={50}
            disabled={loading}
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
          />

          {errors.name && (
            <p className={styles.errorMsg}>{errors.name}</p>
          )}
        </div>
        {/* DESCRIPTION */}
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label}>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write category description..."
            maxLength={300}
            disabled={loading}
            className={styles.textarea}
          />
        </div>

        {/* BUTTONS */}
        <div className={styles.buttonGroup}>
          {isEdit ? (
            <button
              type="button"
              onClick={handleCancel}
              className={styles.buttonSecondary}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className={styles.buttonSecondary}
            >
              Reset
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.buttonPrimary}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />{" "}
                {isEdit ? "Updating..." : "Adding..."}
              </>
            ) : isEdit ? (
              "Update Category"
            ) : (
              "Add Category"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;