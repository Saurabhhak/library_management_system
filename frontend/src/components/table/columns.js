import RowActions from "./RowActions";

const boldCell = (info) => <b>{info.getValue()}</b>;

export const getColumns = (handleDelete) => [
  { header: "Id", accessorKey: "id", enableHiding: true, cell: boldCell },

  {
    header: "First Name",
    accessorKey: "first_name",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "Last Name",
    accessorKey: "last_name",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "Email",
    accessorKey: "email",
    enableColumnFilter: true,
    cell: boldCell,
  },

  { header: "Phone", accessorKey: "phone", cell: boldCell },

  {
    header: "State",
    accessorKey: "state",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "City",
    accessorKey: "city",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "Role",
    accessorKey: "role",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <RowActions row={row} onDelete={handleDelete} />,
  },
];
