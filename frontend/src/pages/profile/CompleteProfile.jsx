import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import styles from "./CompleteProfile.module.css";

import { completeProfile } from "../../services/admin/profile.service";
import { getStates, getCitiesByState } from "../../services/meta.service";
import { validateAdminForm } from "../../utils/validateAdminForm";

function CompleteProfile() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    state_id: "",
    city_id: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- LOAD STATES ---------------- */
  useEffect(() => {
    getStates().then((res) => setStates(res?.data?.data || []));
  }, []);

  /* ---------------- LOAD CITIES ---------------- */
  useEffect(() => {
    if (!form.state_id) return;

    getCitiesByState(form.state_id).then((res) =>
      setCities(res?.data?.data || []),
    );
  }, [form.state_id]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAdminForm(form, "completeProfile");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const confirm = await Swal.fire({
      title: "Complete Profile?",
      text: "Your details will be saved",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await completeProfile(form);

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile completed successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Profile update failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formSection} onSubmit={handleSubmit}>
        <h2 className={styles.tagh1}>Complete Your Profile</h2>

        {/* FIRST NAME */}
        <div>
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className={errors.first_name ? styles.inputError : ""}
          />
          <p className={styles.errorMsg}>{errors.first_name}</p>
        </div>

        {/* LAST NAME */}
        <div>
          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className={errors.last_name ? styles.inputError : ""}
          />
          <p className={styles.errorMsg}>{errors.last_name}</p>
        </div>

        {/* PHONE */}
        <div>
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className={errors.phone ? styles.inputError : ""}
          />
          <p className={styles.errorMsg}>{errors.phone}</p>
        </div>

        {/* STATE */}
        <div>
          <select
            name="state_id"
            value={form.state_id}
            onChange={handleChange}
            className={errors.state_id ? styles.inputError : ""}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <p className={styles.errorMsg}>{errors.state_id}</p>
        </div>

        {/* CITY */}
        <div>
          <select
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            className={errors.city_id ? styles.inputError : ""}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className={styles.errorMsg}>{errors.city_id}</p>
        </div>

        {/* BUTTON */}
        <div className={styles.btnSection}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompleteProfile;
