import { useEffect, useState } from "react";
import styles from "./Category.module.css";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";

function Category() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH CATEGORIES ---------------- */

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- FORM CHANGE ---------------- */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateCategory(editingId, form);
        showMessage("Category updated successfully");
      } else {
        await createCategory(form);
        showMessage("Category created successfully");
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      description: cat.description,
    });
    setEditingId(cat.id);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this category?");
    if (!confirm) return;

    try {
      await deleteCategory(id);
      showMessage("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ---------------- UTIL FUNCTIONS ---------------- */

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Category Management</h2>

      {/* ---------- FORM ---------- */}

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {message && <div className={styles.successMsg}>{message}</div>}

          <input
            className={styles.input}
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <button className={styles.buttonPrimary}>
            {editingId ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>

      {/* ---------- TABLE ---------- */}

      <div className={styles.tableCard}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "1rem" }}>
            Loading categories...
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td>{cat.description}</td>

                    <td>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEdit(cat)}
                      >
                        Edit
                      </button>

                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(cat.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No Categories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Category;
