import CategoriesRowAction from "./CategoriesRowActions";
const boldCell = (info) => <b>{info.getValue()}</b>;

export const getCategoriesColumns = (handleCategoriesDelete) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: boldCell,
    size:70,
  },
  {
    accessorKey: "name",
    header: "Category Name",
    enableColumnFilter: true,
    size:130,
    cell: boldCell,
  },
  {
    accessorKey: "description",
    header: "Description",
    enableColumnFilter: true,
    size:350,
    cell: ({ row }) => row.original.description || "—",
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    size: 90,
    cell: ({ row }) => (
      <CategoriesRowAction
        categories={row.original}
        onDelete={handleCategoriesDelete}
      />
    ),
  },
];
