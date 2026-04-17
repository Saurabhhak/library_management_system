import MemberRowActions from "./MembersRowActions";

const bold = (info) => <b>{info.getValue()}</b>;

export const getColumns = (handleDelete) => [
  { header: "ID", accessorKey: "id", cell: bold },

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

    cell: ({ row }) => (
      <MemberRowActions member={row.original} onDelete={handleDelete} />
    ),
  },
];
