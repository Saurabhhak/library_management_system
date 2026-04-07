import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import BookForm from "./BookForm";
import { getBooks, updateBook } from "../../../services/book.service";
import { getCategories } from "../../../services/category.service";

const initialState = {
  title: "",
  author: "",
  isbn: "",
  category_id: "",
  total_copies: "",
  shelf_location: "",
};

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* Fetching Data */
  useEffect(() => {
    getCategories().then((res) => setCategories(res?.data?.data || []));
    getBooks().then((res) => {
      const book = res.data.data.find((b) => b.id === Number(id));
      setForm(book || initialState);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Update Book?",
      text: "Do you want to update this book?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    if (Number(form.total_copies) <= 0) {
      return Swal.fire("Error", "Copies must be greater than 0", "error");
    }
    try {
      setLoading(true);

      await updateBook(id, {
        ...form,
        category_id: Number(form.category_id),
        total_copies: Number(form.total_copies),
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Book updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/bookinventory");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookForm
      title="Update Book"
      form={form}
      categories={categories}
      errors={errors}
      loading={loading}
      isEdit={true}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleCancel={() => navigate("/bookinventory")}
    />
  );
}

export default UpdateBook;
