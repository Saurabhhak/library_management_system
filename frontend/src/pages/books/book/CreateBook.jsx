import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BookForm from "./BookForm";
import { createBook } from "../../../services/books/book.service";
import { getCategories } from "../../../services/books/category.service";

const initialState = {
  title: "",
  author: "",
  isbn: "",
  category_id: "",
  total_copies: "",
  shelf_location: "",
};

function CreateBook() {
  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then((res) =>
      setCategories(res?.data?.data || [])
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
  };

  const validate = () => {
    const err = {};

    if (!form.title) err.title = "Required";
    if (!form.author) err.author = "Required";
    if (!form.isbn) err.isbn = "Required";
    if (!form.category_id) err.category_id = "Required";

    if (!form.total_copies || Number(form.total_copies) <= 0) {
      err.total_copies = "Must be > 0";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    try {
      setLoading(true);

      await createBook({
        ...form,
        category_id: Number(form.category_id),
        total_copies: Number(form.total_copies),
      });

      Swal.fire("Success", "Book created", "success");

      handleReset(); // 🔥 reset everything
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Error",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookForm
      title="Create Book"
      form={form}
      categories={categories}
      errors={errors}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleReset={handleReset}
    />
  );
}

export default CreateBook;