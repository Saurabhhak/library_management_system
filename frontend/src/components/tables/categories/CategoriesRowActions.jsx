import { useNavigate } from "react-router-dom";
import styles from "../styles/RowAction.module.css";
function CategoriesRowActions({ categories, onDelete }) {
  const navigate = useNavigate();
  const id = categories.id;
  return (
        <div className={styles.acitonsbtn}>
          <button
            onClick={() => navigate(`/updatecategory/${id}`)}
            className={styles.editBtn}
            title="Edit Category"
          >
            <i className="fa-solid fa-file-pen" />
          </button>
          <button
            onClick={() => onDelete(categories)}
            className={styles.deleteBtn}
            title="Delete Category"
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
  );
}

export default CategoriesRowActions;
