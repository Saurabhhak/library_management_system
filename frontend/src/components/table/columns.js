import RowActions from "./RowActions";

const boldCell = (info) => <b>{info.getValue()}</b>;

export const getColumns = (handleDelete) => [
  {
    header: "ID",
    accessorKey: "id",
    cell: boldCell,
  },

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

  {
    header: "Phone",
    accessorKey: "phone",
    cell: boldCell,
  },

  {
    header: "State",
    accessorKey: "state",
    enableColumnFilter: true,
  },

  {
    header: "City",
    accessorKey: "city",
    enableColumnFilter: true,
  },

  {
    header: "Role",
    accessorKey: "role",
    enableColumnFilter: true,
  },

  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,

    cell: ({ row }) => (
      <RowActions
        admin={row.original}
        onDelete={handleDelete}
      />
    ),
  },
];