import AdminRowActions from "./AdminRowActions";
import styles from "./columns.module.css";
import { getRoleInfo } from "../../../utils/roleLabels";

const ONLINE_THRESHOLD_SECONDS = 90;

const timeAgo = (ts) => {
  if (!ts) return "Never";
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const isOnline = (last_seen) => {
  if (!last_seen) return false;
  return (Date.now() - new Date(last_seen)) / 1000 <= ONLINE_THRESHOLD_SECONDS;
};

/* ── Badge ── */
const Badge = ({ label, color }) => (
  <span
    style={{
      padding: "2px 10px",
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      background: `${color}22`,
      color,
    }}
  >
    {label}
  </span>
);

/* ── Online Status ── */
const OnlineStatus = ({ last_seen }) => {
  const online = isOnline(last_seen);
  return (
    <div
      className={`${styles.statusBadge} ${online ? styles.online : styles.offline}`}
    >
      <span
        className={`${styles.statusDot} ${online ? styles.dotOnline : styles.dotOffline}`}
      />
      <span className={styles.statusLabel}>
        {online ? "Online" : timeAgo(last_seen)}
      </span>
    </div>
  );
};

/* ── Function Renamed to getAdminColumns ── */
export const getAdminColumns = (handleDelete) => [
  { header: "ID", accessorKey: "id", size: 70 },
  {
    header: "First Name",
    accessorKey: "first_name",
    enableColumnFilter: true,
    size: 100,
  },
  {
    header: "Last Name",
    accessorKey: "last_name",
    enableColumnFilter: true,
    size: 100,
  },
  {
    header: "DOB",
    accessorKey: "dob",
    size: 80,
    cell: ({ row }) =>
      row.original.dob
        ? new Date(row.original.dob).toLocaleDateString("en-GB")
        : "-",
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 200,
    enableColumnFilter: true,
  },
  { header: "Phone", accessorKey: "phone", size: 125 },
  { header: "State", accessorKey: "state", enableColumnFilter: true },
  { header: "City", accessorKey: "city", enableColumnFilter: true },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const info = getRoleInfo(getValue());
      return <span className={`badge ${info.badgeClass}`}>{info.label}</span>;
    },
  },
  {
    header: "Account",
    accessorKey: "is_active",
    size: 100,
    enableColumnFilter: true,
    cell: ({ getValue }) => (
      <Badge
        label={getValue() ? "Active" : "Inactive"}
        color={getValue() ? "#16a34a" : "#eb4242"}
      />
    ),
  },
  {
    header: "Online",
    accessorKey: "last_seen",
    size: 110,
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => <OnlineStatus last_seen={getValue()} />,
  },
  {
    id: "actions",
    header: "Actions",
    size: 90,
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <AdminRowActions admin={row.original} onDelete={handleDelete} />
    ),
  },
];
