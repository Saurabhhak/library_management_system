import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateAdminForm } from "../../utils/validateAdminForm";

import {
  getStates,
  getCitiesByState,
  getAdminById,
  updateAdmin,
} from "../../services/admin.service";

import AdminForm from "./AdminForm";
import styles from "./CreateAdmin.module.css";

function UpdateAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  /* ------------------ FETCH STATES ------------------ */

  useEffect(() => {
    getStates().then((res) => setStates(res?.data?.data || []));
  }, []);

  /* ------------------ FETCH ADMIN ------------------ */

  useEffect(() => {
    getAdminById(id).then((res) => {
      const admin = res?.data?.data;

      setUserInfo({
        first_name: admin.first_name || "",
        last_name: admin.last_name || "",
        email: admin.email || "",
        phone: admin.phone || "",
        role: admin.role || "",
        state_id: admin.state_id || "",
        city_id: admin.city_id || "",
        password: "",
        confirm_password: "",
      });
    });
  }, [id]);

  /* ------------------ FETCH CITIES ------------------ */

  useEffect(() => {
    if (!userinfo.state_id) return;

    getCitiesByState(userinfo.state_id).then((res) =>
      setCities(res?.data?.data || []),
    );
  }, [userinfo.state_id]);

  /* ------------------ HANDLE CHANGE ------------------ */

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

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateAdminForm(userinfo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await updateAdmin(id, userinfo);

      showNotification("Admin updated successfully", "success");

      setTimeout(() => {
        navigate("/displayadmin");
      }, 1500);
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

  const handleCancel = () => {
    navigate("/displayadmin");
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
        title="Update Admin Account"
        userinfo={userinfo}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        states={states}
        cities={cities}
        errors={errors}
        isEdit={true}
        loading={loading}
      />
    </>
  );
}

export default UpdateAdmin;
