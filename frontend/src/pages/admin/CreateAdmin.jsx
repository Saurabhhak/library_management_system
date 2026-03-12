import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { validateAdminForm } from "../../utils/validateAdminForm";

import {
  createAdmin,
  getStates,
  getCitiesByState,
  // getAdmins,
} from "../../services/admin.service";

import AdminForm from "./AdminForm";
import styles from "./CreateAdmin.module.css";
function CreateAdmin() {
  // const navigate = useNavigate();
  // Disable submit button while request is running
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  // const [admins, setAdmins] = useState([]);
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
  const [userinfo, setUserInfo] = useState(initialState);
  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");
  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);

    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 3000);
  };

  const handleReset = () => {
    setUserInfo(initialState);
    setErrors({});
    setCities([]);
  };
  useEffect(() => {
    getStates().then((res) => setStates(res?.data?.data || []));
  }, []);

  useEffect(() => {
    if (!userinfo.state_id) return;
    getCitiesByState(userinfo.state_id).then((res) =>
      setCities(res?.data?.data || []),
    );
  }, [userinfo.state_id]);
  // get admin data
  // useEffect(() => {
  //   getAdmins().then((res) => setAdmins(res?.data?.data || []));
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Run validation function and get all validation errors
    const validationErrors = validateAdminForm(userinfo, "create");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await createAdmin(userinfo);
      showNotification("Admin created successfully", "success");
      handleReset();
    } catch (error) {
      console.error(error);
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

          <span className={styles.closeBtn} onClick={() => setNotification("")}>
            ✖
          </span>
        </div>
      )}

      <AdminForm
        title="Create Admin Account"
        userinfo={userinfo}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        states={states}
        cities={cities}
        errors={errors}
        isEdit={false}
        loading={loading}
      />
    </>
  );
}

export default CreateAdmin;
