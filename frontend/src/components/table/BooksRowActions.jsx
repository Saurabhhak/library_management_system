import { useNavigate } from "react-router-dom";
import styles from "./RowAction.module.css";
function BooksRowActions({ books, onDelete }) {
  const navigate = useNavigate();
  const id = books.id;
  return (
    <div className={styles.ActionsBTN}>
      <button
        className={styles.ActionEdit}
        onClick={() => navigate(`/updatebook/${id}`)}
      >
        <i className="fa-solid fa-user-pen"></i>
      </button>
      <button className={styles.ActionsDel} onClick={() => onDelete(books)}>
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}

export default BooksRowActions;
