import MemberRowActions from "./MembersRowActions";
import { getMemberTypeInfo } from "../../../utils/roleLabels";
const bold = (info) => <b>{info.getValue()}</b>;

export const getColumns = (handleDelete) => [
  { header: "ID", accessorKey: "id", size: 75, cell: bold },

  {
    header: "First Name",
    accessorKey: "first_name",
    enableColumnFilter: true,
    cell: bold,
  },

  {
    header: "Last Name",
    accessorKey: "last_name",
    enableColumnFilter: true,
    cell: bold,
  },
  {
    accessorKey: "member_type",
    header: "Type",
    cell: ({ getValue }) => {
      const info = getMemberTypeInfo(getValue());
      return <span className={`badge ${info.badgeClass}`}>{info.label}</span>;
    },
  },
  {
    header: "Email",
    accessorKey: "email",
    enableColumnFilter: true,
  },

  {
    header: "Phone",
    accessorKey: "phone",
  },

  {
    header: "State",
    accessorKey: "state",
  },

  {
    header: "City",
    accessorKey: "city",
  },

  {
    header: "Status",
    accessorKey: "status",
  },

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
