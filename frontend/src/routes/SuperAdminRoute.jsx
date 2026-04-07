// import { Navigate } from "react-router-dom";
function SuperAdminRoute({ children }) {

    // const role = localStorage.getItem("role");

    // if (role !== "superadmin") {
    //     return <Navigate to="/" />;
    // }

    return children;
}

export default SuperAdminRoute;