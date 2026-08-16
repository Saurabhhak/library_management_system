import { useNavigate } from "react-router-dom";
import styles from "../styles/RowAction.module.css"; // Check your CSS folder path

function MemberRowActions({ member, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className={styles.acitonsbtn}>
      {/* ___ EDIT MEMBER ___ */}
      <button
        className={styles.editBtn}
        onClick={() => navigate(`/updatemember/${member.id}`)}
        title="Edit Institutional Member"
      >
        <i className="fa-solid fa-user-pen"></i>
      </button>

      {/* ___ DELETE MEMBER ___ */}
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(member)}
        title="Move to Recycle Bin"
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default MemberRowActions;