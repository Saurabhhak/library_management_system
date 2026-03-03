import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Books/CATEGORY_API";
import styles from "./Category.module.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateCategory(editingId, form);
      setSuccessMsg("Category updated successfully");
      setEditingId(null);
    } else {
      await createCategory(form);
      setSuccessMsg("Category created successfully");
    }

    setForm({ name: "", description: "" });
    fetchCategories();

    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      description: cat.description,
    });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    setSuccessMsg("Category deleted successfully");
    fetchCategories();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Category Management</h2>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

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

          <button className={styles.buttonPrimary} type="submit">
            {editingId ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
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
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;
