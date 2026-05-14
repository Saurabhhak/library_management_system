import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { validateMemberForm } from "../../validations/Validatememberform";
import { createMember, getMembers } from "../../services/member/member.service";

import {
  getStates,
  getCitiesByState,
} from "../../services/admin/admin.service";
import { sendOTP, verifyOTP } from "../../services/member/auth.service";
import MemberForm from "./MemberForm";

/* ── Swal helpers ───────────────────────────────────────────────── */
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

/* ── Initial form state ─────────────────────────────────────────── */
const INIT = {
  first_name: "",
  last_name: "",
  phone: "",
  date_of_birth: "",
  email: "",
  state_id: "",
  city_id: "",
  password: "",
  confirm_password: "",
};

/* ─────────────────────────────────────────────────────────────────
   CreateMember
───────────────────────────────────────────────────────────────── */
export default function CreateMember() {
  const [userinfo, setUserInfo] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* OTP state */
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);

  /* fetch states */
  useEffect(() => {
    getStates()
      .then((r) => setStates(r?.data?.data || []))
      .catch(() => alertError("Failed to load states."));
  }, []);

  /* fetch cities on state change */
  useEffect(() => {
    if (!userinfo.state_id) return;
    getCitiesByState(userinfo.state_id)
      .then((r) => setCities(r?.data?.data || []))
      .catch(() => alertError("Failed to load cities."));
  }, [userinfo.state_id]);

  /* reset OTP when email changes */
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setTimer(0);
    setResendDisabled(true);
  }, [userinfo.email]);

  /* countdown */
  useEffect(() => {
    if (!otpSent || timer === 0) {
      if (timer === 0) setResendDisabled(false);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, otpSent]);

  const handleChange = ({ target: { name, value } }) => {
    setUserInfo((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleReset = () => {
    setUserInfo(INIT);
    setErrors({});
  };

  /* send OTP */
  const handleSendOtp = async () => {
    if (!userinfo.email) {
      toast("warning", "Enter an email address first.");
      return;
    }
    try {
      const { data } = await getMembers({ email: userinfo.email });
      if (data.exists) {
        toast("error", "This email is already registered.");
        return;
      }
      await sendOTP({ email: userinfo.email });
      setOtpSent(true);
      setTimer(30);
      setResendDisabled(true);
      toast("success", "OTP sent — check your inbox.");
    } catch (err) {
      alertError(err?.response?.data?.message || "Failed to send OTP.");
    }
  };

  /* verify OTP */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast("warning", "Enter the 6-digit OTP.");
      return;
    }
    try {
      await verifyOTP({ email: userinfo.email, otp });
      setOtpVerified(true);
      toast("success", "Email verified successfully.");
    } catch (err) {
      toast("error", "Invalid OTP — please try again.");
    }
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast("warning", "Please verify your email first.");
      return;
    }

    const errs = validateMemberForm(userinfo, "create");
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast("error", Object.values(errs)[0]);
      return;
    }

    try {
      setLoading(true);
      await createMember(userinfo);
      toast("success", "Member registered successfully.");
      setUserInfo(INIT);
      setErrors({});
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      alertError(
        err?.response?.data?.message ||
          "Could not create member. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MemberForm
      title={
        <>
          <i className="fa-solid fa-user-plus" /> Create Member Account
        </>
      }
      userinfo={userinfo}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      states={states}
      cities={cities}
      errors={errors}
      loading={loading}
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
