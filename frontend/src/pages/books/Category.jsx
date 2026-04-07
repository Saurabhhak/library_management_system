import { useState } from "react";
import Swal from "sweetalert2";
import styles from "./Category.module.css";
import { createCategory } from "../../services/category.service";

const initial_state = {
  name: "",
  description: "",
};

function Category() {
  const [form, setForm] = useState(initial_state);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categoryRegex = /^(?=.*[A-Za-z])[A-Za-z0-9 &(),./-]{3,50}$/;

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // remove error when typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ---------------- RESET ---------------- */
  const resetForm = () => {
    setForm(initial_state);
    setErrors({});
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (form.name === "") {
      newErrors.name = "Category name is required";
    } else if (!categoryRegex.test(form.name)) {
      newErrors.name =
        "3–50 chars, letters required, only letters, numbers, space & ( ) , . / - allowed";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setLoading(true);
      const res = await createCategory(form);
      if (res.length !== 0) {
        await Swal.fire({
          icon: "success",
          title: "Category Added Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        resetForm();
      } else {
        Swal.fire("Error", res.message, "error");
      }
    } catch (err) {
      if (err.response?.data?.message?.includes("exists")) {
        Swal.fire("Duplicate", "Category already exists", "warning");
      } else {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Something went wrong",
          "error",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <header className={styles.formTitle}>
          <i className={`fa-solid fa-layer-group ${styles.titleIcon}`} />
          <h2>Add Category</h2>
        </header>

        {/* Category Name */}
        <div className={styles.field}>
          <label className={styles.label}>
            Category Name <span>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Computer / IT"
            value={form.name}
            onChange={handleChange}
            maxLength={50}
            disabled={loading}
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
          />
          {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
        </div>

        {/* Description */}
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder="Write category description..."
            value={form.description}
            onChange={handleChange}
            maxLength={300}
            disabled={loading}
            className={styles.textarea}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={styles.buttonPrimary}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Adding...
            </>
          ) : (
            "Add Category"
          )}
        </button>
      </form>
    </div>
  );
}

export default Category;
