import { useNavigate } from "react-router-dom";
import styles from "./RowAction.module.css";

function RowActions({ row, onDelete }) {
  const navigate = useNavigate();
  const id = row.original.id;

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
        onClick={() => onDelete(id)}
      >
       <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default RowActions;
