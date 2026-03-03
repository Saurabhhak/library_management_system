// import { ColumnFilter } from "./ColumnFilter";
export const columns = [
  {
    header: "Id",
    accessorKey: "id",
    filterFn: (row, columnId, filterValue) => {
      return row.getValue(columnId) === Number(filterValue);
    },
    enableHiding: true, 
    // Filter: ColumnFilter, for react Table formate
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    header: "First Name",
    accessorKey: "first_name",
    enableColumnFilter: true,
    // Filter: ColumnFilter,
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    header: "Last Name",
    accessorKey: "last_name",
    enableColumnFilter: true,
    // Filter: ColumnFilter,
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    accessorKey: "email",
    header: "email",
    enableColumnFilter: true,
    // Filter: ColumnFilter,
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    // meta: { label: "Contact Number" },
    // Filter: ColumnFilter,
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    header: "State",
    accessorKey: "state",
    enableColumnFilter: true,
    // Filter: ColumnFilter,
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    header: "City",
    accessorKey: "city",
    enableColumnFilter: true,
    // Filter: ColumnFilter,
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    header: "Role",
    accessorKey: "role",
    enableColumnFilter: true,
    // Filter: ColumnFilter,
    cell: (info) => <b>{info.getValue()}</b>,
  },
];
