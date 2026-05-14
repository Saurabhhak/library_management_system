import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { validateAdminForm } from "../../utils/validateAdminForm";
import {
  getStates,
  getCitiesByState,
  getAdminById,
  updateAdmin,
} from "../../services/admin/admin.service";
import AdminForm from "./AdminForm";

/* ── Swal helpers ───────────────────────────────────────────────────── */
const Toast = Swal.mixin({  
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: "#0b0e18",
  color: "#dde6f8",
  iconColor: "#10b981",
});

const toast = (icon, title) => Toast.fire({ icon, title });

const alertError = (text) =>
  Swal.fire({
    icon: "error",
    title: "Something went wrong",
    text,
    background: "#0b0e18",
    color: "#dde6f8",
    confirmButtonColor: "#2563eb",
  });

/* ── DB sends is_active as boolean — convert for the dropdown ───────── */
const toStatus = (v) => (v === true || v === "true" ? "active" : "inactive");

/* ── DOB guard — must be ≥ 18 years old ────────────────────────────── */
const dobError = (dob) => {
  if (!dob) return "Date of birth is required.";
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  if (new Date(dob) > cutoff) return "Admin must be at least 18 years old.";
  return "";
};

/* ── Empty form shape ───────────────────────────────────────────────── */
const EMPTY = {
  first_name: "",
  last_name: "",
  dob: "",
  email: "",
  phone: "",
  role: "",
  state_id: "",
  city_id: "",
  is_active: "",
  password: "",
  confirm_password: "",
};

/* ─────────────────────────────────────────────────────────────────────
   UpdateAdmin
───────────────────────────────────────────────────────────────────── */
export default function UpdateAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userinfo, setUserInfo] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* fetch states */
  useEffect(() => {
    getStates()
      .then((r) => setStates(r?.data?.data || []))
      .catch(() => alertError("Failed to load states."));
  }, []);

  /* prefill admin data */
  useEffect(() => {
    getAdminById(id)
      .then((r) => {
        const a = r?.data?.data;
        if (!a) return;
        setUserInfo({
          first_name: a.first_name || "",
          last_name: a.last_name || "",
          /* normalise ISO timestamp → "YYYY-MM-DD" for the date input */
          dob: a.dob ? new Date(a.dob).toISOString().split("T")[0] : "",
          email: a.email || "",
          phone: a.phone || "",
          role: a.role || "",
          state_id: a.state_id || "",
          city_id: a.city_id || "",
          is_active: toStatus(a.is_active),
          password: "",
          confirm_password: "",
        });
      })
      .catch(() => alertError("Failed to load admin data."));
  }, [id]);

  /* fetch cities when state changes */
  useEffect(() => {
    if (!userinfo.state_id) return;
    getCitiesByState(userinfo.state_id)
      .then((r) => setCities(r?.data?.data || []))
      .catch(() => alertError("Failed to load cities."));
  }, [userinfo.state_id]);

  /* field change */
  const handleChange = ({ target: { name, value } }) => {
    setUserInfo((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validateAdminForm(userinfo, "update");
    const dob = dobError(userinfo.dob);
    if (dob) errs.dob = dob;

    if (Object.keys(errs).length) {
      setErrors(errs);
      toast("error", Object.values(errs)[0]);
      return;
    }

    try {
      setLoading(true);
      /*
        is_active stays as "active" | "inactive" — the backend
        controller's toBoolean() converts it before the DB write.
      */
      await updateAdmin(id, userinfo);
      toast(
        "success",
        `${userinfo.role === "superadmin" ? "Super Admin" : "Admin"} updated successfully.`,
      );
      setTimeout(() => navigate("/admininventory"), 1600);
    } catch (err) {
      console.error("[UpdateAdmin] submit:", err);
      alertError(
        err?.response?.data?.message ||
          "Could not update admin. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminForm
      title={
        <>
          <i className="fa-solid fa-user-shield" /> Update Admin Account
        </>
      }
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      states={states}
      cities={cities}
      errors={errors}
      isEdit={true}
      loading={loading}
    />
  );
}
