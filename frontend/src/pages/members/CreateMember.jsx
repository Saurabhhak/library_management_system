import { useState, useEffect } from "react";
import { validateAdminForm } from "../../utils/validateAdminForm";
import { createMember } from "../../services/member/member.service";
import { getStates, getCitiesByState } from "../../services/meta/meta.service";
import MemberForm from "./MemberForm";
import Swal from "sweetalert2";
function CreateMember() {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

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
      setCities(res?.data?.data || []),
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
      /* VALIDATION ALERT */
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fix the form errors",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#f59e0b",
      });
    }

    try {
      setLoading(true);
      await createMember(userinfo);
      Swal.fire({
        icon: "success",
        title: "Member Created!",
        text: "Member created successfully",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#e5e7eb",
      });

      handleReset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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
