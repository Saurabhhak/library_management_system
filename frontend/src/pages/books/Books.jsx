import styles from "./Books.module.css";
import { useEffect, useState } from "react";
import { getBooks, createBook } from "../../services/bookapi";
import { getCategories } from "../../services/categoryapi";

function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category_id: "",
    total_copies: "",
    shelf_location: "",
  });

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res?.data?.data || []);
    } catch (err) {
      setError("Failed to load books");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res?.data?.data || []);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createBook(form);
      await fetchBooks();
      setForm({
        title: "",
        author: "",
        isbn: "",
        category_id: "",
        total_copies: "",
        shelf_location: "",
      });
    } catch (err) {
      setError("Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Book Management</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          required
        />

        <select
          className={styles.select}
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          className={styles.input}
          name="total_copies"
          type="number"
          placeholder="Total Copies"
          value={form.total_copies}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          name="shelf_location"
          placeholder="Shelf Location"
          value={form.shelf_location}
          onChange={handleChange}
          required
        />

        <button
          className={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.noData}>
                  No books found
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category_name}</td>
                  <td
                    className={
                      book.available_copies > 0
                        ? styles.available
                        : styles.out
                    }
                  >
                    {book.available_copies}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Books;
