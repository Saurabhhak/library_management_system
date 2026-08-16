import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { enrollInstitutionalMember } from "../../services/member/member.service";
import { validateMemberForm } from "../../validations/Validatememberform";
import MemberForm from "./MemberForm";

const INIT = {
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
};

export default function CreateMember() {
  const [userinfo, setUserInfo] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInfo((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateMemberForm(userinfo, "create");
    if (Object.keys(errs).length) return setErrors(errs);

    try {
      setIsSubmitting(true);
      const res = await enrollInstitutionalMember(userinfo);
      const newPassword = res.data?.data?.generated_password;

      // 🔥 Premium Alert showing the generated password to Admin
      await Swal.fire({
        background: "#0d1117",
        color: "#d9edff",
        confirmButtonColor: "#10b981",
        icon: "success",
        title: "Member Enrolled Successfully!",
        html: `
          <p>Please share these login credentials with the user:</p>
          <div style="background: #161b22; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px dashed #3b82f6;">
            <strong>ID:</strong> ${res.data?.data?.institutional_id}<br/>
            <strong>Email:</strong> ${res.data?.data?.email}<br/>
            <strong style="color:#10b981;">Password:</strong> ${newPassword}
          </div>
        `,
      });
      navigate("/memberinventory");
    } catch (err) {
      Swal.fire({
        background: "#0d1117",
        color: "#d9edff",
        confirmButtonColor: "#ef4444",
        icon: "error",
        title: "Enrollment Failed",
        text: err.response?.data?.message || "Could not enroll member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MemberForm
      title={
        <>
          <i className="fa-solid fa-graduation-cap" /> Enroll New Member
        </>
      }
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      isEdit={false}
      isSubmitting={isSubmitting}
    />
  );
}
