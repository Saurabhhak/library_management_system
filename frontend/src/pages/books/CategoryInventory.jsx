import { useState, useEffect } from "react";
import styles from "../dashboard/DisplayAdmin.module.css";
import { getCategories, deleteCategory } from "../../services/books/category.service";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

function CategoryInventory() {
  /* ---------------- STATE ---------------- */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        // adjust path if your service returns data differently
        setData(res?.data?.data || res.data || []);
      } catch (err) {
        console.error("Category fetch failed:", err);
        Swal.fire("Error", "Failed to load categories", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- DELETE CATEGORY ---------------- */
  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      html: `
        <b>ID:</b> ${category.id} <br/>
        <b>Name:</b> ${category.name}
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(category.id);
      setData((prev) => prev.filter((c) => c.id !== category.id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Category removed successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete category",
        "error",
      );
    }
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Category Name",
      enableColumnFilter: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      enableColumnFilter: true,
      cell: ({ row }) => row.original.description || "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original)}
          className={styles.deleteBtn} // add appropriate CSS if needed
          title="Delete Category"
        >
          <i className="fa-solid fa-trash" />
        </button>
      ),
    },
  ];

  /* ---------------- TANSTACK TABLE ---------------- */
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, columnVisibility },

    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: "id", desc: false }],
    },

    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* -------- HEADER SECTION -------- */}
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Category Inventory</h1>

        <div className={styles.searchContainer}>
          <input
            className={styles.SearchBox}
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        {/* COLUMN VISIBILITY TOGGLE */}
        <div className={styles.columnToggle}
        title="Hide Columns feature">
          <details>
            <summary>
              <i className="fa fa-ellipsis-v"></i>
            </summary>

            <div className={styles.dropdownMenu}>
              {table.getAllLeafColumns().map((column) => (
                <label key={column.id} className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  {column.columnDef.header}
                </label>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* -------- TABLE -------- */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          {/* -------- TABLE HEADER -------- */}
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <div
                      className={styles.headerContent}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>

                      <span className={styles.sortIcon}>
                        {{
                          asc: "▲",
                          desc: "▼",
                        }[header.column.getIsSorted()] ?? ""}
                      </span>
                    </div>

                    {/* per‑column filter */}
                    {header.column.getCanFilter() && (
                      <input
                        className={styles.columnFilter}
                        placeholder="Filter..."
                        value={header.column.getFilterValue() ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* -------- TABLE BODY -------- */}
          <tbody className={styles.tbody}>
            {loading ? (
              <tr>
                <td colSpan={table.getAllColumns().length}>
                  <span className={styles.loading}>
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>{" "}
                    Loading data...
                  </span>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length}>No records found</td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* --------------------- PAGINATION ------------------------ */}
        <div className={styles.paginationSection}>
          {/* -------- PAGE SIZE -------- */}
          <div style={{ position: "relative" }}>
            <div
              className={styles.pageSizeButton}
              onClick={() => setPageSizeOpen((prev) => !prev)}
            >
              Show {table.getState().pagination.pageSize}
            </div>

            {pageSizeOpen && (
              <div className={styles.pageSizeMenu}>
                {[5, 10, 20, 50].map((size) => (
                  <div
                    key={size}
                    className={`${styles.pageSizeItem} ${
                      table.getState().pagination.pageSize === size
                        ? styles.activeItem
                        : ""
                    }`}
                    onClick={() => {
                      table.setPageSize(size);
                      setPageSizeOpen(false);
                    }}
                  >
                    Show {size}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* -------- BUTTONS -------- */}
          <div className={styles.paginationControls}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              ⏮ First
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ◀ Prev
            </button>

            <span className={styles.pageInfo}>
              Page <b>{table.getState().pagination.pageIndex + 1}</b> of{" "}
              <b>{table.getPageCount()}</b>
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next ▶
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last ⏭
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryInventory;
