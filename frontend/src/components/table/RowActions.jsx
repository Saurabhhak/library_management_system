import { useNavigate } from "react-router-dom";
import styles from "./RowAction.module.css";

function RowActions({ admin, onDelete }) {
  const navigate = useNavigate();
  const id = admin.id;

  return (
    <div className={styles.ActionsBTN}>
      <button
        className={styles.ActionEdit}
        onClick={() => navigate(`/updateadmin/${id}`)}
      >
        <i class="fa-solid fa-user-pen"></i>
      </button>
      <button
        className={styles.ActionsDel}
        onClick={() => onDelete(admin)}
        // Button Disabled Option
        // disabled={admin.role === "superadmin"}
        // className={`${styles.ActionsDel} ${admin.role} === "superadmin" ? ${styles.disabledBtn} : ""`}
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default RowActions;