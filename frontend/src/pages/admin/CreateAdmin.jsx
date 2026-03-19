import { useState, useEffect } from "react";
import { validateAdminForm } from "../../utils/validateAdminForm";
import {
  createAdmin,
  getStates,
  getCitiesByState,
} from "../../services/admin.service";
import { sendOtpAPI, verifyOtpAPI } from "../../services/otp.service";

import AdminForm from "./AdminForm";
import styles from "./CreateAdmin.module.css";
import { checkEmailAPI } from "../../services/auth.service";
function CreateAdmin() {
  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // ⏱ Timer states (ONLY HERE)
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);

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
    password: "",
    confirm_password: "",
  };
  const handleReset = () => {
    setUserInfo(initialState);
  };
  const [userinfo, setUserInfo] = useState(initialState);

  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");

  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);
    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 5000);
  };

  // RESET on email change
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setTimer(0);
    setResendDisabled(true);
  }, [userinfo.email]);

  // TIMER LOGIC (single source of truth)
  useEffect(() => {
    if (!otpSent) return;

    if (timer === 0) {
      setResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, otpSent]);

  useEffect(() => {
    getStates().then((res) => setStates(res?.data?.data || []));
  }, []);

  useEffect(() => {
    if (!userinfo.state_id) return;
    getCitiesByState(userinfo.state_id).then((res) =>
      setCities(res?.data?.data || []),
    );
  }, [userinfo.state_id]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // SEND OTP
  const handleSendOtp = async () => {
    if (!userinfo.email) {
      showNotification("Enter email first", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userinfo.email)) {
      showNotification("Invalid email", "error");
      return;
    }

    try {
      // STEP 1: Check email first
      const res = await checkEmailAPI({ email: userinfo.email });

      if (res.data.exists) {
        showNotification("Admin already exists with this email", "error");
        return;
      }
      // STEP 2: Send OTP
      await sendOtpAPI({ email: userinfo.email });

      setOtpSent(true);
      setOtpVerified(false);
      setTimer(30);
      setResendDisabled(true);

      showNotification("OTP sent successfully", "success");
    } catch {
      showNotification("Something went wrong", "error");
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showNotification("Enter valid 6 digit OTP", "error");
      return;
    }
    try {
      await verifyOtpAPI({ email: userinfo.email, otp });
      setOtpVerified(true);
      showNotification("OTP verified", "success");
    } catch {
      showNotification("Invalid OTP", "error");
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      showNotification("Verify OTP first", "error");
      return;
    }

    const validationErrors = validateAdminForm(userinfo, "create");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      // FORCE ROLE (IMPORTANT)
      const payload = {
        ...userinfo,
        role: "superadmin",
      };

      await createAdmin(payload);

      showNotification("Superadmin created", "success");
      setUserInfo(initialState);
    } catch (error) {
      showNotification(
        error?.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <div className={`${styles.notify} ${styles[notifyType]}`}>
          {notification}
        </div>
      )}

      <AdminForm
        title="Create Admin Account"
        handleReset={handleReset}
        userinfo={userinfo}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
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
    </>
  );
}

export default CreateAdmin;
