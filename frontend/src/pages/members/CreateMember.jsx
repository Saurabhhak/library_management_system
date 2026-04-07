import { useState, useEffect } from "react";
import { validateAdminForm } from "../../utils/validateAdminForm";
import { createMember } from "../../services/member.service";
import { getStates, getCitiesByState } from "../../services/meta.service";
import MemberForm from "./MemberForm";
import styles from "./CreateMember.module.css";

function CreateMember() {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");

  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    state_id: "",
    city_id: "",
    password: "",
    confirm_password: "",
  };

  const [userinfo, setUserInfo] = useState(initialState);

  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);
    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 4000);
  };

  // Load states
  useEffect(() => {
    getStates().then((res) => setStates(res?.data?.data || []));
  }, []);

  // Load cities
  useEffect(() => {
    if (!userinfo.state_id) {
      setCities([]);
      return;
    }
    getCitiesByState(userinfo.state_id).then((res) =>
      setCities(res?.data?.data || [])
    );
  }, [userinfo.state_id]);

  // Handle change (with city reset)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state_id" && { city_id: "" }), // reset city
    }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const handleReset = () => {
    setUserInfo(initialState);
    setErrors({});
    setCities([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAdminForm(userinfo, "create");
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await createMember(userinfo);

      showNotification("Member created successfully", "success");

      handleReset();
    } catch (error) {
      showNotification(
        error?.response?.data?.message || "Something went wrong",
        "error"
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

      <MemberForm
        title="Create Member Account"
        userinfo={userinfo}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        states={states}
        cities={cities}
        errors={errors}
        loading={loading}
      />
    </>
  );
}

export default CreateMember;