import { useState, useEffect } from "react";
import styles from "./DisplayAdmin.module.css";
import { getAdmins, deleteAdmin } from "../../services/admin.service";
import { getColumns } from "../../components/table/columns";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

function DisplayAdmin() {
  /* ---------------- STATE ---------------- */

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  /* ---------------- FETCH ADMINS ---------------- */

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await getAdmins();
        setData(res?.data?.data || []);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  /* ---------------- DELETE ADMIN ---------------- */
  const handleDelete = async (admin) => {
    const result = await Swal.fire({
      title: "Delete Admin?",
      html: `
      <b>ID:</b> ${admin.id} <br/>
      <b>Role:</b> ${admin.role} <br/>
      <b>Name:</b> ${admin.first_name} ${admin.last_name}

    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAdmin(admin.id);
      setData((prev) =>
        prev.filter((a) => a.id !== admin.id)
      );
      Swal.fire("Deleted!", "Admin removed successfully", "success");
    } catch (err) {
      console.error(err);
    }
  };
  /* ---------------- TABLE COLUMNS ---------------- */

  // columns generate with delete function
  const columns = getColumns(handleDelete);

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
        <h1 className={styles.title}>Admin Records</h1>

        <div className={styles.searchContainer}>
          <input
            className={styles.SearchBox}
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        {/* COLUMN VISIBILITY */}
        <div className={styles.columnToggle}>
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
                    {/* column title + sorting */}

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

                    {/* column filter */}

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
                <td colSpan={table.getAllColumns().length}>Loading data...</td>
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

        {/* -------- PAGINATION -------- */}

        <div className={styles.paginationSection}>
          {/* page size */}

          <select
            className={styles.paginationSize}
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {/* pagination buttons */}

          <div className={styles.paginationControls}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>

            <span className={styles.pageInfo}>
              Page {table.getState().pagination.pageIndex + 1} of
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayAdmin;
