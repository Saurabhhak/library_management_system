import { useState, useEffect, useRef } from "react";
import styles from "./Inventory.module.css";
import { getAdmins, deleteAdmin } from "../../services/admin/admin.service";
import { getColumns } from "../../components/tables/admin/columns";
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

function DisplayAdmin() {
  /* ---------------- STATE ---------------- */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  /* Column Ordering (drag & drop) Column Resizing */
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnSizing, setColumnSizing] = useState({});
  const [columnSizingInfo, setColumnSizingInfo] = useState({});

  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  /* Row Selection  */
  const [rowSelection, setRowSelection] = useState({});
  const dropdownRef = useRef(null);
  const [activePageBtn, setActivePageBtn] = useState("");
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
  /* _________________ CLOSE DROPDOWN _________________ */
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPageSizeOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  /* ---------------- DELETE ADMIN ---------------- */
  const handleDelete = async (admin) => {
    // Prevent SuperAdmin deletion
    if (admin.role === "superadmin") {
      return Swal.fire({
        icon: "error",
        title: "Action Not Allowed",
        text: "SuperAdmin cannot be deleted!",
        background: "#0f172a", // dark bg (tailwind slate-900)
        color: "#e5e7eb", // text color
      });
    }
    const result = await Swal.fire({
      title: "Delete Admin?",
      html: `
      <b>ID:</b> ${admin.id} <br/>
      <b>Role:</b> ${admin.role} <br/>
      <b>Name:</b> ${admin.first_name} ${admin.last_name}
    `,
      icon: "warning",
      background: "#0f172a", // dark bg (tailwind slate-900)
      color: "#e5e7eb", // text color
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAdmin(admin.id);
      setData((prev) => prev.filter((a) => a.id !== admin.id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Admin removed successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete admin",
      });
    }
  };
  /* _______________________ BULK DELETE FUNCTION _______________________*/
  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      return Swal.fire({
        icon: "info",
        title: "No Selection",
        text: "Please select at least one row",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#3b82f6",
      });
    }

    const ids = selectedRows.map((row) => row.original.id);

    const result = await Swal.fire({
      title: `Delete ${ids.length} Members?`,
      text: "This action cannot be undone!",
      icon: "warning",

      /* COLORS CONTROL */
      background: "#0f172a",
      color: "#e5e7eb",

      showCancelButton: true,
      confirmButtonText: "Delete All",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",

      reverseButtons: true,

      /* Animation UX */
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });

    if (!result.isConfirmed) return;

    try {
      /* FAST PARALLEL DELETE */
      await Promise.all(ids.map((id) => deleteAdmin(id)));
      /* UPDATE UI */
      setData((prev) => prev.filter((m) => !ids.includes(m.id)));
      /* CLEAR SELECTION */
      setRowSelection({});
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${ids.length} members removed`,
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#e5e7eb",
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Bulk delete failed",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#ef4444",
      });
    }
  };
  /* ---------------- TABLE COLUMNS ---------------- */

  // columns generate with delete function
  /* __________________ TABLE __________________ */
  const baseColumns = getColumns(handleDelete);

  const columns = [
    {
      id: "select",
      size: 10,
      header: ({ table }) => (
        <input
          type="checkbox"
          title="Select All Row"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    ...baseColumns,
  ];

  /* --------------- TANSTACK TABLE ---------------- */
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      columnVisibility,
      columnOrder,
      columnSizing,
      columnSizingInfo,
      rowSelection,
    },

    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: "id", desc: false }],
    },

    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,

    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    columnResizeMode: "onChange",

    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* _________________ SMART DROPDOWN _________________ */
  const handleToggleDropdown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownHeight = 125;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight;
    setDropdownStyle({
      left: rect.left,
      top: openUp ? rect.top - dropdownHeight - 5 : rect.bottom + 5,
    });
    setPageSizeOpen((prev) => !prev);
  };

  return (
    <>
      {/* -------- HEADER SECTION -------- */}
      <div className={styles.headerBar}>
        <h1 className={styles.title} title="Admin Table Page">
          <i className="fa-solid fa-user-shield" />
          Admins
        </h1>
        <Link
          to="/createadmin"
          className={styles.chartBtn}
          title="Create New Admin"
        >
          <i className="fa-solid fa-user-plus"></i> Admin
        </Link>
        {/* -------- CHART NAV BUTTON -------- */}
        <Link
          to="/adminpage"
          className={styles.chartBtn}
          title="View Analytics Dashboard"
        >
          <i className="fa-solid fa-chart-line"></i> Charts
        </Link>
        <div className={styles.searchContainer}>
          <input
            className={styles.SearchBox}
            title="Globle Seacrh Adimn ID, Name, Email, State, City and Role "
            placeholder="Search"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        {/* ___________Row Selection */}
        <div className={styles.RowSelections} title="Selected Row Count">
          <p className={styles.RowSelectionTitle}>Selected Row</p>
          <span
            className={`${styles.selectedRow} ${
              Object.keys(rowSelection).length === 0
                ? styles.CountSelectRow
                : ""
            }`}
          >
            {Object.keys(rowSelection).length}
          </span>
        </div>
        <button
          onClick={handleBulkDelete}
          title="Selected Row Delete"
          disabled={Object.keys(rowSelection).length === 0}
          className={`${styles.bulkDeleteBtn} ${
            Object.keys(rowSelection).length === 0 ? styles.disabledBtn : ""
          }`}
        >
          <i className="fa-solid fa-trash"></i>
          Bulk Delete
        </button>

        {/* ___________________COLUMN VISIBILITY */}
        <div className={styles.columnToggle} title="Hide Columns">
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
                  <th
                    key={header.id}
                    style={{ width: header.getSize(), position: "relative" }}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("colId", header.column.id)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const draggedCol = e.dataTransfer.getData("colId");
                      const targetCol = header.column.id;
                      const newOrder = table
                        .getAllLeafColumns()
                        .map((c) => c.id);
                      const fromIndex = newOrder.indexOf(draggedCol);
                      const toIndex = newOrder.indexOf(targetCol);
                      newOrder.splice(fromIndex, 1);
                      newOrder.splice(toIndex, 0, draggedCol);
                      setColumnOrder(newOrder);
                    }}
                  >
                    {/* ── HEADER: title + sort icon ── */}
                    <div
                      className={styles.headerTop}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      style={{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                    >
                      <span className={styles.headerTitle}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>

                      {/* ✅ Only show on sortable columns, no default icon */}
                      {header.column.getCanSort() && (
                        <span
                          className={`${styles.sortIcon} ${header.column.getIsSorted() ? styles.sortActive : ""}`}
                        >
                          {header.column.getIsSorted() === "asc" && (
                            <i className="fa-solid fa-arrow-up" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <i className="fa-solid fa-arrow-down" />
                          )}
                          {!header.column.getIsSorted() && (
                            <i className="fa-solid fa-sort" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* ── FILTER: only on filterable columns ── */}
                    {header.column.getCanFilter() && (
                      <input
                        className={styles.columnFilter}
                        placeholder="Search..."
                        value={header.column.getFilterValue() ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}

                    {/* ── RESIZER ── */}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={styles.resizer}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* -------- TABLE BODY -------- */}
          <tbody className={styles.tbody}>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={table.getAllColumns().length}>
                    <div className={styles.skeletonRow}></div>
                  </td>
                </tr>
              ))
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
        {/* ____________ PAGINATION ____________ */}
        <div className={styles.paginationSection}>
          {/* PAGE SIZE */}
          <div ref={dropdownRef}>
            <div
              className={styles.pageSizeButton}
              onClick={handleToggleDropdown}
            >
              Show {table.getState().pagination.pageSize}{" "}
              <i className="fa-solid fa-chevron-down"></i>
            </div>
            {pageSizeOpen && (
              <div className={styles.pageSizeMenu} style={dropdownStyle}>
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
              onClick={() => {
                table.setPageIndex(0);
                setActivePageBtn("first"); // ADD
              }}
              className={activePageBtn === "first" ? styles.activeBtn : ""}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fa-solid fa-angles-left"></i> First
            </button>

            <button
              onClick={() => {
                table.previousPage();
                setActivePageBtn("prev"); // ADD
              }}
              className={activePageBtn === "prev" ? styles.activeBtn : ""}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fa-solid fa-chevron-left"></i> Prev
            </button>

            <span className={styles.pageInfo}>
              <b>{table.getState().pagination.pageIndex + 1}</b> /{" "}
              <b>{table.getPageCount()}</b>
            </span>

            <button
              onClick={() => {
                table.nextPage();
                setActivePageBtn("next"); // ADD
              }}
              className={activePageBtn === "next" ? styles.activeBtn : ""}
              disabled={!table.getCanNextPage()}
            >
              Next <i className="fa-solid fa-chevron-right"></i>
            </button>

            <button
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
                setActivePageBtn("last"); // ADD
              }}
              className={activePageBtn === "last" ? styles.activeBtn : ""}
              disabled={!table.getCanNextPage()}
            >
              Last <i className="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default DisplayAdmin;
