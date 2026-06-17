import { useState } from "react";
import styles from "./ContactRowActions.module.css";

const STATUS_CYCLE = { new: "read", read: "replied", replied: "new" };
const STATUS_LABEL = {
  new: "Mark as Read",
  read: "Mark as Replied",
  replied: "Reset to New",
};
const STATUS_ICON = {
  new: "fa-envelope-open",
  read: "fa-circle-check",
  replied: "fa-rotate-left",
};

function ContactRowActions({ contact, onDelete, onStatusChange, onView }) {
  const [busy, setBusy] = useState(false);

  const handleStatus = async () => {
    setBusy(true);
    await onStatusChange(contact.id, STATUS_CYCLE[contact.status]);
    setBusy(false);
  };

  return (
    <div className={styles.actions}>
      {/* View full message */}
      <button
        className={styles.btnView}
        onClick={() => onView(contact)}
        title="View Full Message"
      >
        <i className="fa-solid fa-expand" />
      </button>

      {/* Cycle status */}
      <button
        className={styles.btnStatus}
        onClick={handleStatus}
        disabled={busy}
        title={STATUS_LABEL[contact.status]}
      >
        <i className={`fa-solid ${STATUS_ICON[contact.status]}`} />
      </button>

      {/* Quick reply via mailto */}
      <button
        className={styles.btnReply}
        onClick={() =>
          window.open(
            `mailto:${contact.email}?subject=Re: ${encodeURIComponent(
              contact.subject || "Your enquiry",
            )}`,
            "_blank",
          )
        }
        title="Reply via Email"
      >
        <i className="fa-solid fa-reply" />
      </button>

      {/* Delete */}
      <button
        className={styles.btnDelete}
        onClick={() => onDelete(contact)}
        title="Delete Contact"
      >
        <i className="fa-solid fa-trash" />
      </button>
    </div>
  );
}

export default ContactRowActions;
