import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import MemberForm from "./MemberForm";
import { getMemberById, updateMember } from "../../services/member/member.service";
import { validateAdminForm } from "../../utils/validateAdminForm";
import { useFetchStatesCities } from "../../utils/useFetchStatesCities";

function UpdateMember() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    state_id: "",
    city_id: "",
    membership_start: "",
    membership_end: "",
    max_books_allowed: 3,
    status: "active",
  };

  const [userinfo, setUserInfo] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { states, cities } = useFetchStatesCities(userinfo.state_id);

  /* ---------------- FETCH MEMBER ---------------- */
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await getMemberById(id);
        const m = res?.data?.data;

        if (!m) return;

        setUserInfo({
          first_name: m.first_name || "",
          last_name: m.last_name || "",
          email: m.email || "",
          phone: m.phone || "",
          state_id: m.state_id || "",
          city_id: m.city_id || "",
          membership_start: m.membership_start || "",
          membership_end: m.membership_end || "",
          max_books_allowed: m.max_books_allowed || 3,
          status: m.status || "active",
        });
      } catch (err) {
        Swal.fire("Error", "Failed to load member", "error");
      }
    };

    fetchMember();
  }, [id]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state_id" && { city_id: "" }),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
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
      title: "Update Member?",
      text: "Are you sure you want to update this member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await updateMember(id, userinfo);
      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Member updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/memberinventory");
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
      navigate("/memberinventory");
    }
  };

  return (
    <MemberForm
      title="Update Member"
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      states={states}
      cities={cities}
      errors={errors}
      loading={loading}
      isEdit={true}
    />
  );
}

export default UpdateMember;
