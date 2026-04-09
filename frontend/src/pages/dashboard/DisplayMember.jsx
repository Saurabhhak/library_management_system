import { useState, useEffect } from "react";
import styles from "./DisplayAdmin.module.css";
import { getMembers, deleteMember } from "../../services/member.service";
import { getColumns } from "../../components/table/memberColumns";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

function DisplayMember() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  /* ---------------- FETCH MEMBERS ---------------- */
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        console.log("API DATA:", res.data); // DEBUG
        setData(res?.data?.data || []);
      } catch (err) {
        console.error("Member fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* ---------------- DELETE MEMBER ---------------- */
  const handleDelete = async (member) => {
    const result = await Swal.fire({
      title: "Delete Member?",
      html: `
        <b>ID:</b> ${member.id} <br/>
        <b>Name:</b> ${member.first_name} ${member.last_name}
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMember(member.id);

      setData((prev) => prev.filter((m) => m.id !== member.id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete member", "error");
    }
  };

  /* ---------------- TABLE ---------------- */
  const columns = getColumns(handleDelete);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, columnVisibility },

    initialState: {
      pagination: { pageSize: 10 },
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
      {/* HEADER */}
      <div className={styles.headerBar}>
        <Link
          to="/createmember"
          className={styles.chartBtn}
          title="Create Member"
        >
          + Add Member
        </Link>
        {/* -------- CHART NAV BUTTON -------- */}
        <Link
          to="/memberpage"
          className={styles.chartBtn}
          title="View Analytics Dashboard"
        >
          View Charts
        </Link>
        <h1 className={styles.title}>Member Records</h1>
        <div className={styles.searchContainer}>
          <input
            className={styles.SearchBox}
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        {/* COLUMN TOGGLE */}
        <div className={styles.columnToggle} title="Hide Columns feature">
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

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id}>
                    <div
                      className={styles.headerContent}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      <span className={styles.sortIcon} title="Sorting">
                        {{
                          asc: "▲",
                          desc: "▼",
                        }[header.column.getIsSorted()] ?? ""}
                      </span>
                    </div>

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

          <tbody className={styles.tbody}>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <span className={styles.loading}>
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>{" "}
                    Loading data...
                  </span>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No members found</td>
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

export default DisplayMember;
