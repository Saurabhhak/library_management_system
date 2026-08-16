import { useNavigate } from "react-router-dom";
import styles from "../styles/RowAction.module.css"; // Check your CSS folder path

function AdminRowActions({ admin, onDelete }) {
  const navigate = useNavigate();
  const isSuperAdmin = admin.role === "superadmin";

  return (
    <div className={styles.acitonsbtn}>
      {/* ___ EDIT ADMIN ___ */}
      <button
        className={styles.editBtn}
        onClick={() => navigate(`/updateadmin/${admin.id}`)}
        title="Edit Admin"
      >
        <i className="fa-solid fa-user-pen"></i>
      </button>

      {/* ___ DELETE ADMIN (Disabled for Super Admin) ___ */}
      <button
        className={`${styles.deleteBtn} ${isSuperAdmin ? styles.disabledBtn : ""}`}
        onClick={() => !isSuperAdmin && onDelete(admin)}
        disabled={isSuperAdmin}
        title={isSuperAdmin ? "Super Admin cannot be deleted" : "Delete Admin"}
        style={isSuperAdmin ? { opacity: 0.4, cursor: "not-allowed" } : {}}
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default AdminRowActions;
