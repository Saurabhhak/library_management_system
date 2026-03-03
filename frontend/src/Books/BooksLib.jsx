import { useEffect, useState } from "react";
import { getBooks, createBook } from "../Books/BOOK_API";
import axios from "axios";
import styles from "./Books.module.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category_id: "",
    total_copies: "",
    shelf_location: "",
  });

  const fetchBooks = async () => {
    const res = await getBooks();
    setBooks(res.data.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBook(form);
    fetchBooks();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book Management</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="author"
          placeholder="Author"
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="isbn"
          placeholder="ISBN"
          onChange={handleChange}
        />

        <select
          className={styles.select}
          name="category_id"
          onChange={handleChange}
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
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="shelf_location"
          placeholder="Shelf Location"
          onChange={handleChange}
        />

        <button className={styles.button} type="submit">
          Add Book
        </button>
      </form>

      <div className={styles.tableContainer}>
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
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category_name}</td>
                <td
                  className={
                    book.available_copies > 0
                      ? styles.statusAvailable
                      : styles.statusOut
                  }
                >
                  {book.available_copies}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Books;
