import { useState } from "react";
import API from "../../api/axiosInstance";
import styles from "./IssueBook.module.css";

function IssueBook() {
  const [form, setForm] = useState({
    member_id: "",
    book_id: "",
    due_date: "",
  });

  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Frontend Validation
  const validate = () => {
    let err = {};
    if (!form.member_id) err.member_id = "Member ID required";
    if (!form.book_id) err.book_id = "Book ID required";
    if (!form.due_date) err.due_date = "Due date required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await API.post("/issues", form);
      alert("Book Issued Successfully");
      setForm({ member_id: "", book_id: "", due_date: "" });
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formTitle}>
          <i className="fa-solid fa-book-open"></i>
          <h2>Issue Book</h2>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Member ID</label>
          <input
            className={`${styles.input} ${errors.member_id ? styles.inputError : ""}`}
            name="member_id"
            value={form.member_id}
            onChange={handleChange}
          />
          {errors.member_id && (
            <span className={styles.errorMsg}>{errors.member_id}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Book ID</label>
          <input
            className={`${styles.input} ${errors.book_id ? styles.inputError : ""}`}
            name="book_id"
            value={form.book_id}
            onChange={handleChange}
          />
          {errors.book_id && (
            <span className={styles.errorMsg}>{errors.book_id}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Due Date</label>
          <input
            type="date"
            className={`${styles.input} ${errors.due_date ? styles.inputError : ""}`}
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />
          {errors.due_date && (
            <span className={styles.errorMsg}>{errors.due_date}</span>
          )}
        </div>

        <button className={styles.buttonPrimary}>Issue Book</button>
      </form>
    </div>
  );
}

export default IssueBook;
