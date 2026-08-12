import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { validateAdminForm } from "../../utils/validateAdminForm";
import {
  createAdmin,
  getStates,
  getCitiesByState,
} from "../../services/admin/admin.service";
import {
  sendOtp,
  verifyOtp,
  checkEmail,
} from "../../services/auth/otp.service";
import AdminForm from "./AdminForm";

/* ── Swal Helpers ── */
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

/* ── Form Constants & Validation ── */
const dobError = (dob) => {
  if (!dob) return "Date of birth is required.";
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  if (new Date(dob) > cutoff) return "Admin must be at least 18 years old.";
  return "";
};

const INIT = {
  first_name: "",
  last_name: "",
  dob: "",
  email: "",
  phone: "",
  role: "admin",
  state_id: "",
  city_id: "",
  password: "",
  confirm_password: "",
  is_active: "",
};

export default function CreateAdmin() {
  const [userinfo, setUserInfo] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* ── Loading States ── */
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── OTP States ── */
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);

  /* ── Data Fetching ── */
  useEffect(() => {
    getStates()
      .then((r) => setStates(r?.data?.data || []))
      .catch(() => alertError("Failed to load states."));
  }, []);

  useEffect(() => {
    if (!userinfo.state_id) return;
    getCitiesByState(userinfo.state_id)
      .then((r) => setCities(r?.data?.data || []))
      .catch(() => alertError("Failed to load cities."));
  }, [userinfo.state_id]);

  /* Reset OTP states if email is edited */
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setTimer(0);
    setResendDisabled(true);
  }, [userinfo.email]);

  /* OTP Timer logic */
  useEffect(() => {
    if (!otpSent || timer === 0) {
      if (timer === 0) setResendDisabled(false);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, otpSent]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    setUserInfo((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleReset = () => {
    setUserInfo(INIT);
    setErrors({});
  };

  /* ── Send OTP ── */
  const handleSendOtp = async () => {
    if (!userinfo.email)
      return toast("warning", "Enter an email address first.");

    try {
      setIsSendingOtp(true);
      const { data } = await checkEmail({
        email: userinfo.email,
        role: "admin",
      });
      if (data.exists)
        return toast("error", "An admin with this email already exists.");

      await sendOtp({
        email: userinfo.email,
        role: "admin",
        purpose: "registration",
      });

      setOtpSent(true);
      setTimer(30);
      setResendDisabled(true);
      toast("success", "OTP sent — check your inbox.");
    } catch (err) {
      console.error("[OTP Error]:", err);
      alertError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  /* ── Verify OTP ── */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast("warning", "Enter the 6-digit OTP.");

    try {
      setIsVerifyingOtp(true);
      await verifyOtp({
        email: userinfo.email,
        otp,
        role: "admin",
        purpose: "registration",
      });

      setOtpVerified(true);
      toast("success", "Email verified successfully.");
    } catch (err) {
      console.error("[Verify Error]:", err);
      toast(
        "error",
        err?.response?.data?.message || "Invalid OTP — please try again.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /* ── Submit Form ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified)
      return toast("warning", "Please verify your email before submitting.");

    const errs = validateAdminForm(userinfo, "create");
    const dobErr = dobError(userinfo.dob);
    if (dobErr) errs.dob = dobErr;

    if (Object.keys(errs).length) {
      setErrors(errs);
      return toast("error", Object.values(errs)[0]);
    }

    try {
      setIsSubmitting(true);
      await createAdmin(userinfo);

      toast(
        "success",
        `${userinfo.role === "superadmin" ? "Super Admin" : "Admin"} created successfully.`,
      );
      setUserInfo(INIT);
      setErrors({});
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      console.error("[Submit Error]:", err);
      alertError(err?.response?.data?.message || "Could not create admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={
        <>
          <i className="fa-solid fa-user-shield" /> Create Admin Account
        </>
      }
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      states={states}
      cities={cities}
      errors={errors}
      /* New Loading Props */
      isSubmitting={isSubmitting}
      isSendingOtp={isSendingOtp}
      isVerifyingOtp={isVerifyingOtp}
      /* OTP Props */
      handleSendOtp={handleSendOtp}
      handleVerifyOtp={handleVerifyOtp}
      otp={otp}
      setOtp={setOtp}
      otpSent={otpSent}
      otpVerified={otpVerified}
      timer={timer}
      resendDisabled={resendDisabled}
    />
  );
}
