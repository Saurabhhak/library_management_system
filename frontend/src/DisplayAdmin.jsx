import ADMINAPI from "./adminserver";
import { useState, useEffect } from "react";
import styles from "./DisplayAdmin.module.css";
import { columns } from "./columns";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

function DisplayAdmin() {
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  /* ----- FETCH DATA ----- */
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await ADMINAPI.get("/");
        setData(res.data.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  /* ----- TABLE CONFIG ----- */
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, columnVisibility },
    initialState: {
      // DEFAULT PAGE (FIRST PAGE) // DEFAULT PAGE SIZE
      pagination: { pageSize: 5, pageIndex: 0 },
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {/* ----- TITLE ----- */}
      <div className={styles.TitleDiv}>
        <h1 className={styles.title}>Admin Records</h1>
      </div>

      {/* ----- GLOBAL SEARCH ----- */}
      <div className={styles.searchContainer}>
        <input
          className={styles.SearchBox}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
        />
      </div>

      {/* ----- TABLE WRAPPER ----- */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {/* ----- COLUMN VISIBILITY ROW ----- */}
            <tr className={styles.checkboxRow}>
              {table.getAllLeafColumns().map((column) => (
                <th key={column.id}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />
                    {column.columnDef.header}
                  </label>
                </th>
              ))}
            </tr>

            {/* ----- HEADER ROW ----- */}
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {/* HEADER FLEX (Title + Sort Icon) */}
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

                    {/* ----- COLUMN FILTER ----- */}
                    {header.column.getCanFilter() && (
                      <input
                        className={styles.columnFilter}
                        value={header.column.getFilterValue() ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        placeholder="Filter..."
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ----- TABLE BODY ----- */}
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

        {/* ----- PAGINATION ----- */}
        <div className={styles.paginationSection}>
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
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
