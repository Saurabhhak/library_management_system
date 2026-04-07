import styles from "./BookForm.module.css";

function BookForm({
  title,
  form,
  categories,
  errors,
  loading,
  isEdit = false,
  handleChange,
  handleSubmit,
  handleReset,
  handleCancel,
}) {
  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formSection} noValidate>
        <h1 className={styles.heading}>{title}</h1>

        {/* TITLE */}
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`${styles.input} ${errors.title && styles.inputError}`}
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>

        {/* AUTHOR */}
        <div className={styles.formGroup}>
          <label>Author</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            className={`${styles.input} ${errors.author && styles.inputError}`}
          />
          {errors.author && <p className={styles.error}>{errors.author}</p>}
        </div>

        {/* ISBN */}
        {!isEdit && (
          <div className={styles.formGroup}>
            <label>ISBN</label>
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              className={`${styles.input} ${errors.isbn && styles.inputError}`}
            />
            {errors.isbn && <p className={styles.error}>{errors.isbn}</p>}
          </div>
        )}

        {/* CATEGORY */}
        <div className={styles.formGroup}>
          <label>Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.category_id && styles.inputError
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className={styles.error}>{errors.category_id}</p>
          )}
        </div>

        {/* COPIES */}
        <div className={styles.formGroup}>
          <label>Total Copies</label>
          <input
            type="number"
            name="total_copies"
            value={form.total_copies}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.total_copies && styles.inputError
            }`}
          />
          {errors.total_copies && (
            <p className={styles.error}>{errors.total_copies}</p>
          )}
        </div>

        {/* LOCATION */}
        <div className={styles.formGroup}>
          <label>Shelf Location</label>
          <input
            name="shelf_location"
            value={form.shelf_location}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.shelf_location && styles.inputError
            }`}
          />
          {errors.shelf_location && (
            <p className={styles.error}>{errors.shelf_location}</p>
          )}
        </div>

        {/* BUTTONS */}
        <div className={styles.btnSection}>
          {isEdit ? (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          ) : (
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Book"
              : "Create Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;