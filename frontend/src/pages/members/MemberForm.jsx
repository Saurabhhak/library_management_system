import { useState } from "react";
import styles from "./MemberForm.module.css";
import { useNavigate } from "react-router-dom";

function MemberForm({
  title,
  userinfo,
  handleChange,
  handleSubmit,
  handleReset,
  handleCancel,
  states = [],
  cities = [],
  errors = {},
  isEdit = false,
  loading = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Smart cancel handler (parent OR fallback)
  const onCancel = () => {
    if (handleCancel) {
      handleCancel();
    } else {
      navigate("/displayadmin");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h1 className={styles.tagh1}>{title}</h1>

        {/* First Name */}
        <div className={styles.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={userinfo.first_name}
            onChange={handleChange}
            className={`${styles.formInput} ${errors?.first_name ? styles.inputError : ""}`}
          />
          {errors?.first_name && <p className={styles.errorMsg}>{errors.first_name}</p>}
        </div>

        {/* Last Name */}
        <div className={styles.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={userinfo.last_name}
            onChange={handleChange}
            className={`${styles.formInput} ${errors?.last_name ? styles.inputError : ""}`}
          />
          {errors?.last_name && <p className={styles.errorMsg}>{errors.last_name}</p>}
        </div>

        {/* Email */}
        {!isEdit && (
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userinfo.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors?.email ? styles.inputError : ""}`}
            />
            {errors?.email && <p className={styles.errorMsg}>{errors.email}</p>}
          </div>
        )}

        {/* Phone */}
        <div className={styles.formGroup}>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={userinfo.phone}
            onChange={handleChange}
            className={`${styles.formInput} ${errors?.phone ? styles.inputError : ""}`}
          />
          {errors?.phone && <p className={styles.errorMsg}>{errors.phone}</p>}
        </div>

        {/* State */}
        <div className={styles.formGroup}>
          <label>State</label>
          <select
            name="state_id"
            value={userinfo.state_id}
            onChange={handleChange}
            className={`${styles.formInput} ${errors?.state_id ? styles.inputError : ""}`}
          >
            <option value="">Choose state</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors?.state_id && <p className={styles.errorMsg}>{errors.state_id}</p>}
        </div>

        {/* City */}
        <div className={styles.formGroup}>
          <label>City</label>
          <select
            name="city_id"
            value={userinfo.city_id}
            onChange={handleChange}
            className={`${styles.formInput} ${errors?.city_id ? styles.inputError : ""}`}
          >
            <option value="">Choose city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors?.city_id && <p className={styles.errorMsg}>{errors.city_id}</p>}
        </div>

        {/* Password */}
        {!isEdit && (
          <>
            <div className={styles.password_wrapper}>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userinfo.password}
                onChange={handleChange}
                className={`${styles.formInput} ${errors?.password ? styles.inputError : ""}`}
              />
              <span className={styles.eye_icon} onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </span>
              {errors?.password && <p className={styles.errorMsg}>{errors.password}</p>}
            </div>

            <div className={styles.password_wrapper}>
              <label>Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                value={userinfo.confirm_password}
                onChange={handleChange}
                className={`${styles.formInput} ${errors?.confirm_password ? styles.inputError : ""}`}
              />
              <span className={styles.eye_icon} onClick={() => setShowConfirm(!showConfirm)}>
                <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} />
              </span>
              {errors?.confirm_password && (
                <p className={styles.errorMsg}>{errors.confirm_password}</p>
              )}
            </div>
          </>
        )}

        {/* Buttons */}
        <div className={styles.btnSection}>
          {isEdit ? (
            <button type="button" onClick={onCancel} className={styles.btnFeature}>
              Cancel
            </button>
          ) : (
            <button type="button" onClick={handleReset} className={styles.btnFeature}>
              Reset
            </button>
          )}

          <button type="submit" className={styles.btnFeature} disabled={loading}>
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Member"
              : "Create Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;