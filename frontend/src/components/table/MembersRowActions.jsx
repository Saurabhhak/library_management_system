import { useNavigate } from "react-router-dom";
import styles from "./RowAction.module.css";

function MemberRowActions({ member, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className={styles.ActionsBTN}>
      {/* EDIT */}
      <button
        className={styles.ActionEdit}
        onClick={() => navigate(`/updatemember/${member.id}`)}
        title="Edit Member"
      >
        <i className="fa-solid fa-user-pen"></i>
      </button>

      {/* DELETE */}
      <button
        className={styles.ActionsDel}
        onClick={() => onDelete(member)}
        title="Delete Member"
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default MemberRowActions;