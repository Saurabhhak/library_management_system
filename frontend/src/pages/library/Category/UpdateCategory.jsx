import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import CategoryForm from "./CategoryForm"; // ✅ FIXED

import {
  updateCategory,
  getCategories,
} from "../../../services/books/category.service";

function UpdateCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categoryRegex = /^(?=.*[A-Za-z])[A-Za-z0-9 &(),./-]{3,50}$/;

  /* FETCH */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        const data = res?.data?.data || [];

        const category = data.find((c) => String(c.id) === id);

        if (category) {
          setForm({
            name: category.name,
            description: category.description || "",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [id]);

  /* CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name) {
      newErrors.name = "Category name required";
    } else if (!categoryRegex.test(form.name)) {
      newErrors.name = "Invalid format";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      await updateCategory(id, form);

      await Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/categoryinventory");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/categoryinventory");
  };

  return (
    <CategoryForm
      title="Update Category"
      form={form}
      errors={errors}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      isEdit={true}
    />
  );
}

export default UpdateCategory;