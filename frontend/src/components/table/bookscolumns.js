import BooksRowActions from "./BooksRowActions";
const boldCell = (info) => <b>{info.getValue()}</b>;

export const getBooksColumns = (handleBooksDelete) => [
  {
    header: "ID",
    accessorKey: "id",
    cell: boldCell,
  },

  {
    header: "title",
    accessorKey: "title",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "author",
    accessorKey: "author",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "isbn",
    accessorKey: "isbn",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "category_name",
    accessorKey: "category_name",
    enableColumnFilter: true,
  },

  {
    header: "total_copies",
    accessorKey: "total_copies",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    header: "shelf_location",
    accessorKey: "shelf_location",
    enableColumnFilter: true,
    cell: boldCell,
  },

  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <BooksRowActions books={row.original} onDelete={handleBooksDelete} />
    ),
  },
];
