import "./AdminSignup.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ADMINAPI from "./adminserver";

function AdminSignForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    state_id: "",
    city_id: "",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [getData, setGetData] = useState([]);
  const [userinfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    state_id: "",
    city_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    })); // remove error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  // ---------------- get Data check email existance
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await ADMINAPI.get("/");
        setGetData(res.data.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load data");
      }
    };
    fetchEmp();
  }, []);
  // -------------------------- load states
  // -------------- load states
  useEffect(() => {
    ADMINAPI.get("/meta/states")
      .then((res) => setStates(res.data.data || []))
      .catch((err) => {
        console.log(err);
        setStates([]);
      });
  }, []);
  // ------------------------ load cities when state changes
  useEffect(() => {
    if (!userinfo.state_id) {
      setCities([]);
      return;
    }
    ADMINAPI.get(`/meta/cities/${userinfo.state_id}`)
      .then((res) => setCities(res.data.data || []))
      .catch((err) => {
        console.log(err);
        setCities([]);
      });
  }, [userinfo.state_id]);
  //------------------Notification Auto Hide features
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);
  // ----------------- Input Reset Functionality
  const handleReset = () => {
    setUserInfo({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      state_id: "",
      city_id: "",
    });
    setErrors({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      state_id: "",
      city_id: "",
    });
  };
  //-------------------------- OnSubmit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      first_name: userinfo.first_name ? "" : "First Name field is required",
      last_name: userinfo.last_name ? "" : "Last Name field is required",
      email: userinfo.email ? "" : "Email field is required",
      password: userinfo.password ? "" : "Password field is required",
      confirm_password: userinfo.confirm_password
        ? ""
        : "confirm_password field is required",
      phone: userinfo.phone ? "" : "Phone field is required",
      state_id: userinfo.state_id ? "" : "State field is required",
      city_id: userinfo.city_id ? "" : "City Name is required",
    };
    setErrors(newErrors);
    // Stop submit if any error exists
    if (
      newErrors.first_name ||
      newErrors.last_name ||
      newErrors.email ||
      newErrors.password ||
      newErrors.confirm_password ||
      newErrors.phone ||
      newErrors.state_id ||
      newErrors.city_id
    )
      return;
    //---- Verify User Email Already Exists
    const emailExists = getData.some((item) => item.email === userinfo.email);
    if (emailExists) {
      setNotification({
        message: "Email already exists",
        type: "error",
      });
      return;
    }
    //---- Verify User Phone Already Exists
    const phoneExists = getData.some((item) => item.phone === userinfo.phone);
    if (phoneExists) {
      setNotification({
        message: "Phone already exists",
        type: "error",
      });
      return;
    }
    // ---- Validation Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userinfo.email)) {
      setNotification({
        message: "Invalid email format",
        type: "error",
      });
      return;
    }
    // ---- Validation Password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(userinfo.password)) {
      setNotification({
        message: "Password must be strong",
        type: "error",
      });
      return;
    }
    const confirm_passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!confirm_passwordRegex.test(userinfo.confirm_password)) {
      setNotification({
        message: "Password must be strong",
        type: "error",
      });
      return;
    }
    if (userinfo.password !== userinfo.confirm_password) {
      setNotification({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }
    try {
      await ADMINAPI.post("/", userinfo);

      setNotification({
        message: "Admin created successfully",
        type: "success",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || "Signup failed",
        type: "error",
      });
    }
  };
  console.log(userinfo);
  return (
    <>
      {notification.message && (
        <div className={`notify ${notification.type}`}>
          {notification.message}
          <span
            className="closeBtn"
            onClick={() => setNotification({ message: "", type: "" })}
          >
            ✖
          </span>
        </div>
      )}

      <div className="headers">
        <div className="leftIcon">
          <i className="fa-solid fa-book"></i>
        </div>
        <div className="centerTitle">
          <h2>APV Tech Library</h2>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-section">
          <h1 className="tagh1">Create Admin Account</h1>

          <input
            className={`form-input ${errors.first_name ? "input-error" : ""}`}
            name="first_name"
            placeholder="First name"
            value={userinfo.first_name}
            onChange={handleChange}
          />
          {errors.first_name && (
            <span className="error-msg">{errors.first_name}</span>
          )}
          <input
            className={`form-input ${errors.last_name ? "input-error" : ""}`}
            name="last_name"
            placeholder="Last name"
            value={userinfo.last_name}
            onChange={handleChange}
          />
          {errors.last_name && (
            <span className="error-msg">{errors.last_name}</span>
          )}
          <input
            className={`form-input ${errors.email ? "input-error" : ""}`}
            name="email"
            placeholder="Email"
            value={userinfo.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
          <input
            className={`form-input ${errors.phone ? "input-error" : ""}`}
            name="phone"
            placeholder="Phone"
            value={userinfo.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error-msg">{errors.phone}</span>}
          <div className="password-wrapper">
            <input
              className={`form-input ${errors.password ? "input-error" : ""}`}
              type={showPassword ? "text" : "password"} // ✅ FIXED
              name="password"
              placeholder="Password"
              value={userinfo.password}
              onChange={handleChange}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </span>
          </div>

          {errors.password && (
            <span className="error-msg">{errors.password}</span>
          )}

          <div className="password-wrapper">
            <input
              className={`form-input ${errors.confirm_password ? "input-error" : ""}`}
              type={showConfirmPassword ? "text" : "password"} // ✅ CORRECT
              name="confirm_password"
              placeholder="Confirm Password"
              value={userinfo.confirm_password}
              onChange={handleChange}
            />

            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <i
                className={`fa-solid ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </span>
          </div>

          {errors.confirm_password && (
            <span className="error-msg">{errors.confirm_password}</span>
          )}

          <select
            className={`form-input ${errors.state_id ? "input-error" : ""}`}
            name="state_id"
            value={userinfo.state_id}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state_id && (
            <span className="error-msg">{errors.state_id}</span>
          )}
          <select
            className={`form-input ${errors.city_id ? "input-error" : ""}`}
            name="city_id"
            value={userinfo.city_id}
            onChange={handleChange}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city_id && (
            <span className="error-msg">{errors.city_id}</span>
          )}
          <div className="btn_section">
            <input type="reset" className="btn_feature" onClick={handleReset} />
            <input type="submit" className="btn_feature" />
          </div>
          <p>
            <Link to="/login" className="linkStyle">
              Already have account? Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default AdminSignForm;
