import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import MemberForm from "./MemberForm";
import {
  getMemberById,
  updateMember,
} from "../../services/member/member.service";
import {
  getStates,
  getCitiesByState,
} from "../../services/admin/admin.service";

const INIT = {
  first_name: "",
  last_name: "",
  phone: "",
  date_of_birth: "",
  state_id: "",
  city_id: "",
  membership_end: "",
  max_books_allowed: 3,
  status: "active",
};

/**
 * UpdateMember — admin-only edit page.
 * Any admin/superadmin can update a member's profile at any time after
 * the member has registered (this does NOT touch login credentials —
 * password changes go through the member's own forgot/reset-password flow).
 */
function UpdateMember() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userinfo, setUserInfo] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* ── Fetch states ─────────────────────────────────────────────── */
  useEffect(() => {
    getStates()
      .then((r) => setStates(r?.data?.data || []))
      .catch(() => Swal.fire("Error", "Failed to load states.", "error"));
  }, []);

  /* ── Fetch member ─────────────────────────────────────────────── */
  useEffect(() => {
    getMemberById(id)
      .then((res) => {
        const m = res?.data?.data;
        if (!m) return;
        setUserInfo({
          first_name: m.first_name || "",
          last_name: m.last_name || "",
          phone: m.phone || "",
          date_of_birth: m.date_of_birth
            ? new Date(m.date_of_birth).toISOString().split("T")[0]
            : "",
          state_id: m.state_id || "",
          city_id: m.city_id || "",
          membership_end: m.membership_end
            ? new Date(m.membership_end).toISOString().split("T")[0]
            : "",
          max_books_allowed: m.max_books_allowed || 3,
          status: m.status || "active",
        });
      })
      .catch(() => Swal.fire("Error", "Failed to load member.", "error"))
      .finally(() => setFetching(false));
  }, [id]);

  /* ── Fetch cities when state changes ─────────────────────────── */
  useEffect(() => {
    if (!userinfo.state_id) return;
    getCitiesByState(userinfo.state_id)
      .then((r) => setCities(r?.data?.data || []))
      .catch(() => Swal.fire("Error", "Failed to load cities.", "error"));
  }, [userinfo.state_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state_id" && { city_id: "" }), // reset city on state change
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!userinfo.first_name?.trim())
      errs.first_name = "First name is required.";
    if (!userinfo.phone?.trim()) errs.phone = "Phone is required.";
    if (!userinfo.state_id) errs.state_id = "State is required.";
    if (!userinfo.city_id) errs.city_id = "City is required.";
    if (!userinfo.status) errs.status = "Status is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const confirm = await Swal.fire({
      title: "Update Member?",
      text: "Are you sure you want to update this member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      background: "#0f172a",
      color: "#e5e7eb",
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
        background: "#0f172a",
        color: "#e5e7eb",
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

  if (fetching)
    return (
      <p style={{ textAlign: "center", padding: "3rem" }}>Loading member…</p>
    );

  return (
    <MemberForm
      title="Update Member"
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      states={states}
      cities={cities}
      errors={errors}
      loading={loading}
    />
  );
}

export default UpdateMember;
