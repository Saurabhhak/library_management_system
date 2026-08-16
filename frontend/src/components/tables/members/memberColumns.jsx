import MemberRowActions from "./MemberRowActions";
import { getMemberTypeInfo } from "../../../utils/roleLabels";

const bold = (info) => <b>{info.getValue()}</b>;

/* ── Function Renamed to getMemberColumns ── */
export const getMemberColumns = (handleDelete) => [
  { header: "ID", accessorKey: "id", size: 60 },
  {
    header: "Inst. ID",
    accessorKey: "institutional_id",
    size: 140,
    enableColumnFilter: true,
    cell: bold,
  },
  { header: "First Name", accessorKey: "first_name", enableColumnFilter: true },
  { header: "Last Name", accessorKey: "last_name", enableColumnFilter: true },
  {
    accessorKey: "member_type",
    header: "Role",
    cell: ({ getValue }) => {
      const info = getMemberTypeInfo(getValue());
      return <span className={`badge ${info.badgeClass}`}>{info.label}</span>;
    },
  },
  {
    header: "Course / Dept",
    accessorKey: "course",
    cell: ({ row }) => {
      // Show Course for students, Department for Teachers/Professors
      const { course, department, member_type } = row.original;
      if (member_type === "student") return course || "-";
      return department || "-";
    },
  },
  {
    header: "Email",
    accessorKey: "email",
    enableColumnFilter: true,
    size: 200,
  },
  { header: "Phone", accessorKey: "phone" },
  { header: "Status", accessorKey: "status" },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    size: 90,
    cell: ({ row }) => (
      <MemberRowActions member={row.original} onDelete={handleDelete} />
    ),
  },
];
