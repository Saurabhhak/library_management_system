import FeedbackRowActions from "./RowActions";

/* ── helpers ── */
const fmt = (ts) =>
  ts
    ? new Date(ts).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const truncate = (str, n = 55) =>
  str && str.length > n ? str.slice(0, n) + "…" : str || "—";

const StatusBadge = ({ status }) => {
  const map = {
    new: { label: "New", color: "#f59e0b" },
    reviewed: { label: "Reviewed", color: "#3b82f6" },
    resolved: { label: "Resolved", color: "#22c55e" },
  };
  const { label, color } = map[status] || map.new;
  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        background: `${color}22`,
        color,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
};

export const getFeedbackColumns = (
  handleDelete,
  handleStatusChange,
  handleView,
) => [
  { header: "ID", accessorKey: "id", size: 60 },
  { header: "Name", accessorKey: "name", size: 120, enableColumnFilter: true },
  {
    header: "Email",
    accessorKey: "email",
    size: 190,
    enableColumnFilter: true,
  },
  {
    header: "Message",
    accessorKey: "message",
    size: 260,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <span style={{ color: "#8b9ab0", fontSize: 13 }} title={getValue()}>
        {truncate(getValue())}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 110,
    enableColumnFilter: true,
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    header: "IP",
    accessorKey: "ip_address",
    size: 120,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <span
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          color: "#5a6880",
        }}
      >
        {getValue() || "—"}
      </span>
    ),
  },
  {
    header: "Submitted",
    accessorKey: "created_at",
    size: 160,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <span style={{ fontSize: 12, color: "#6b7a94" }}>{fmt(getValue())}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <FeedbackRowActions
        feedback={row.original}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onView={handleView}
      />
    ),
  },
];
