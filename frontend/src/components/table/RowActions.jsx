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
        className={styles.ActionEdit}
        onClick={() => onDelete(admin)}
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default RowActions;
