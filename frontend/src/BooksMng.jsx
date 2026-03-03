import styles from "./Books.module.css";
import "./ramdom.css";
function BooksMng() {
  return (
    <>
      <h1 className="ramdom">Books Managemnet Section</h1>
      <div className={styles.BookContainner}>
        <h2 className={styles.BooksMng}>Books Section</h2>
      </div>
    </>
  );
}
export default BooksMng;
