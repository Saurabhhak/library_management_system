import RowActions from "./RowActions";

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

const OnlineStatus = ({ last_seen }) => {
  const online = isOnline(last_seen);
  const color = online ? "#22c55e" : "#9ca3af";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 12, color }}>
        {online ? "Online" : timeAgo(last_seen)}
      </span>
    </div>
  );
};

export const getColumns = (handleDelete) => [
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
    cell: ({ row }) => {
      const dob = row.original.dob;

      if (!dob) return "-";

      return new Date(dob).toLocaleDateString("en-GB");
      //  Output: DD/MM/YYYY
    },
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
    header: "Role",
    accessorKey: "role",
    size: 120,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const role = getValue();
      return (
        <Badge
          label={role === "superadmin" ? "Super Admin" : "Admin"}
          color={role === "superadmin" ? "#8e4dff" : "#3583ff"}
        />
      );
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
    size: 100,
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => <OnlineStatus last_seen={getValue()} />,
  },

  {
    id: "actions",
    header: "Actions",
    size: 90,
    enableSorting: false, //  no sort icon
    enableColumnFilter: false, //  no filter input
    cell: ({ row }) => (
      <RowActions admin={row.original} onDelete={handleDelete} />
    ),
  },
];
