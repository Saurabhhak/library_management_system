import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { validateAdminForm } from "../../utils/validateAdminForm";
import { sendInvite } from "../../services/admin/invite.service";
import AdminForm from "./AdminForm";

function CreateAdmin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    role: "admin",
  };

  const [userinfo, setUserInfo] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = async () => {
    const confirm = await Swal.fire({
      title: "Reset Form?",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      setUserInfo(initialState);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAdminForm(userinfo, "create");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const confirm = await Swal.fire({
      title: "Send Invite?",
      text: "Invitation email will be sent",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      const res = await sendInvite(userinfo);

      await Swal.fire("Success", res.data.message, "success");

      navigate("/displayadmin");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Invite failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminForm
      title="Create Admin"
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      errors={errors}
      loading={loading}
      mode="create"
    />
  );
}

export default CreateAdmin;
