import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

import { validateAdminForm } from "../../utils/validateAdminForm";
import { getAdminById, updateAdmin } from "../../services/admin/admin.service";
import { getStates, getCitiesByState } from "../../services/meta.service";

import AdminForm from "./AdminForm";

function UpdateAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    state_id: "",
    city_id: "",
  };

  const [userinfo, setUserInfo] = useState(initialState);

  /* ---------------- FETCH STATES ---------------- */
  useEffect(() => {
    getStates().then((res) => setStates(res?.data?.data || []));
  }, []);

  /* ---------------- FETCH ADMIN ---------------- */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminById(id);
        const admin = res?.data?.data;

        setUserInfo({
          first_name: admin.first_name || "",
          last_name: admin.last_name || "",
          email: admin.email || "",
          phone: admin.phone || "",
          role: admin.role || "",
          state_id: admin.state_id || "",
          city_id: admin.city_id || "",
        });
      } catch {
        Swal.fire("Error", "Failed to fetch admin data", "error");
      }
    };

    fetchAdmin();
  }, [id]);

  /* ---------------- FETCH CITIES ---------------- */
  useEffect(() => {
    if (!userinfo.state_id) return;

    getCitiesByState(userinfo.state_id).then((res) =>
      setCities(res?.data?.data || []),
    );
  }, [userinfo.state_id]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ---------------- CANCEL ---------------- */
  const handleCancel = async () => {
    const confirm = await Swal.fire({
      title: "Cancel?",
      text: "Changes will be lost",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (confirm.isConfirmed) {
      navigate("/displayadmin");
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAdminForm(userinfo, "update");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const confirm = await Swal.fire({
      title: "Update Admin?",
      text: "Are you sure you want to update this admin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await updateAdmin(id, userinfo);

      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Admin updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/displayadmin");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Update failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminForm
      title="Update Admin"
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleReset={handleCancel}
      states={states}
      cities={cities}
      errors={errors}
      loading={loading}
      mode="update"
    />
  );
}

export default UpdateAdmin;
