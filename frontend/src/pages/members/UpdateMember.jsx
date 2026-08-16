import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getMemberById,
  updateMember,
} from "../../services/member/member.service";
import { validateMemberForm } from "../../validations/Validatememberform";
import MemberForm from "./MemberForm";

/* ── Swal Helpers ── */
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: "#0d1117",
  color: "#dde6f8",
  iconColor: "#10b981",
});

const alertError = (text) =>
  Swal.fire({
    icon: "error",
    title: "Something went wrong",
    text,
    background: "#0d1117",
    color: "#dde6f8",
    confirmButtonColor: "#ef4444",
  });

/* ── Initial Empty State ── */
const EMPTY = {
  member_type: "",
  institutional_id: "",
  course: "",
  batch_year: "",
  department: "",
  designation: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  status: "active",
  max_books_allowed: 3,
};

export default function UpdateMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userinfo, setUserInfo] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Page Loader for Fetching Data

  /* ── 1. Fetch Member Data ── */
  useEffect(() => {
    getMemberById(id)
      .then((res) => {
        const m = res?.data?.data;
        if (m) {
          setUserInfo({
            member_type: m.member_type || "",
            institutional_id: m.institutional_id || "",
            course: m.course || "",
            batch_year: m.batch_year || "",
            department: m.department || "",
            designation: m.designation || "",
            first_name: m.first_name || "",
            last_name: m.last_name || "",
            email: m.email || "",
            phone: m.phone || "",
            status: m.status || "active",
            max_books_allowed: m.max_books_allowed || 3,
          });
        }
      })
      .catch(() => alertError("Failed to load member data."))
      .finally(() => setIsLoading(false));
  }, [id]);

  /* ── 2. Handle Inputs ── */
  const handleChange = (e) => {
    setUserInfo((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  /* ── 3. Submit Updates ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Strict Validation
    const errs = validateMemberForm(userinfo, "update");
    if (Object.keys(errs).length) {
      setErrors(errs);
      return Toast.fire({
        icon: "error",
        title: Object.values(errs)[0],
        iconColor: "#ef4444",
      });
    }

    try {
      setIsSubmitting(true);
      await updateMember(id, userinfo);

      Toast.fire({
        icon: "success",
        title: "Member updated successfully.",
      });

      // Navigate back to inventory smoothly
      setTimeout(() => navigate("/memberinventory"), 1500);
    } catch (err) {
      console.error("[Update Member Error]:", err);
      alertError(
        err?.response?.data?.message ||
          "Could not update member. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── 4. Loading State Rendering ── */
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
        }}
      >
        <h3>
          <i
            className="fa-solid fa-spinner fa-spin"
            style={{ marginRight: "10px", color: "#3b82f6" }}
          />{" "}
          Loading Member Data...
        </h3>
      </div>
    );
  }

  /* ── 5. Main Form Rendering ── */
  return (
    <MemberForm
      title={
        <>
          <i className="fa-solid fa-user-pen" /> Update Institutional Member
        </>
      }
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      isEdit={true} // Passes isEdit=true to disable Email/     ID/Role modification
      isSubmitting={isSubmitting}
    />
  );
}
