import { useNavigate } from "react-router-dom";
import styles from "./RowAction.module.css";
function BooksRowActions({ books, onDelete }) {
  const navigate = useNavigate();
  const id = books.id;
  return (
    <div className={styles.acitonsbtn}>
      <button
        className={styles.editBtn}
        onClick={() => navigate(`/updatebook/${id}`)}
        title="Edit Book"
      >
        <i className="fa-solid fa-file-pen" />
      </button>
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(books)}
        title="Delete Member"
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default BooksRowActions;
