import styles from "./AdminForm.module.css";

function AdminForm({
  title,
  userinfo,
  handleChange,
  handleSubmit,
  handleReset,
  errors,
  loading,
  states,
  cities,
  mode = "create",
}) {
  const isCreate = mode === "create";

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.grid}>
          {/* FIRST NAME */}
          <div>
            <input
              name="first_name"
              placeholder="First Name"
              value={userinfo.first_name}
              onChange={handleChange}
              className={errors.first_name ? styles.errorInput : ""}
            />
            <p>{errors.first_name}</p>
          </div>

          {/* LAST NAME */}
          <div>
            <input
              name="last_name"
              placeholder="Last Name"
              value={userinfo.last_name}
              onChange={handleChange}
              className={errors.last_name ? styles.errorInput : ""}
            />
            <p>{errors.last_name}</p>
          </div>
          {/* EMAIL */}
          <div className={styles.full}>
            <input
              name="email"
              placeholder="Email"
              value={userinfo.email}
              onChange={handleChange}
              disabled={!isCreate}
              className={errors.email ? styles.errorInput : ""}
            />
            <p>{errors.email}</p>
          </div>
          {/* ROLE */}
          <div>
            <select name="role" value={userinfo.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          {/* UPDATE ONLY FIELDS */}
          {!isCreate && (
            <>
              {/* PHONE */}
              <div>
                <input
                  name="phone"
                  placeholder="Phone"
                  value={userinfo.phone}
                  onChange={handleChange}
                />
              </div>
              {/* STATE */}
              <select
                name="state_id"
                value={userinfo.state_id}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* CITY */}
              <select
                name="city_id"
                value={userinfo.city_id}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* BUTTONS */}
        <div className={styles.actions}>
          <button type="button" onClick={handleReset}>
            {isCreate ? "Reset" : "Cancel"}
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isCreate ? "Send Invite" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminForm;
