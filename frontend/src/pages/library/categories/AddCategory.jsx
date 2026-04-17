import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import CategoryForm from "./CategoryForm";
import { createCategory } from "../../../services/books/category.service";

const initial_state = {
  name: "",
  description: "",
};

function AddCategory() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initial_state);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categoryRegex = /^(?=.*[A-Za-z])[A-Za-z0-9 &(),./-]{3,50}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setForm(initial_state);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name) {
      newErrors.name = "Category name is required";
    } else if (!categoryRegex.test(form.name)) {
      newErrors.name = "3–50 chars, valid format required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      await createCategory(form);

      await Swal.fire({
        icon: "success",
        title: "Category Added",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/categoryinventory");
    } catch (err) {
      if (err.response?.data?.message?.includes("exists")) {
        Swal.fire("Duplicate", "Category already exists", "warning");
      } else {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Something went wrong",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryForm
      title="Add Category"
      form={form}
      errors={errors}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      isEdit={false}
    />
  );
}

export default AddCategory;