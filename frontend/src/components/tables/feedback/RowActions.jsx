import { useState } from "react";
import styles from "./RowActions.module.css";

const STATUS_CYCLE = { new: "reviewed", reviewed: "resolved", resolved: "new" };
const STATUS_LABEL = {
  new: "Mark Reviewed",
  reviewed: "Mark Resolved",
  resolved: "Reset to New",
};
const STATUS_ICON = {
  new: "fa-eye",
  reviewed: "fa-circle-check",
  resolved: "fa-rotate-left",
};

function FeedbackRowActions({ feedback, onDelete, onStatusChange, onView }) {
  const [busy, setBusy] = useState(false);

  const handleStatus = async () => {
    setBusy(true);
    await onStatusChange(feedback.id, STATUS_CYCLE[feedback.status]);
    setBusy(false);
  };

  return (
    <div className={styles.actions}>
      <button
        className={styles.btnView}
        onClick={() => onView(feedback)}
        title="View Full Message"
      >
        <i className="fa-solid fa-expand" />
      </button>

      <button
        className={styles.btnStatus}
        onClick={handleStatus}
        disabled={busy}
        title={STATUS_LABEL[feedback.status]}
      >
        <i className={`fa-solid ${STATUS_ICON[feedback.status]}`} />
      </button>

      <button
        className={styles.btnDelete}
        onClick={() => onDelete(feedback)}
        title="Delete Feedback"
      >
        <i className="fa-solid fa-trash" />
      </button>
    </div>
  );
}

export default FeedbackRowActions;
