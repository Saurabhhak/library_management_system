import { useState, useEffect, useRef } from "react";
import styles from "./ContactInventory.module.css";
import {
  getContacts,
  deleteContact,
  updateContactStatus,
} from "../../services/contact/contact.service";
import { getContactColumns } from "../../components/tables/contact/Contactcolumns";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

/* ── Status counts helper ── */
const countByStatus = (data) => ({
  total: data.length,
  new: data.filter((c) => c.status === "new").length,
  read: data.filter((c) => c.status === "read").length,
  replied: data.filter((c) => c.status === "replied").length,
});

const swalDark = { background: "#0d1117", color: "#d9edff" };

function ContactInventory() {
  /* ── State ── */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [columnSizingInfo, setColumnSizingInfo] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [activePageBtn, setActivePageBtn] = useState("");
  const dropdownRef = useRef(null);

  /* ── Fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getContacts();
        setData(res?.data?.data || []);
      } catch (err) {
        console.error("Contact fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Close page-size dropdown on outside click ── */
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setPageSizeOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ── View full message ── */
  const handleView = (contact) => {
    Swal.fire({
      ...swalDark,
      title: `Contact #${contact.id}`,
      html: `
        <div style="text-align:left;font-size:14px;line-height:1.7;color:#d0daf0">
          <p><b style="color:#10a5c8">Name:</b> ${contact.name}</p>
          <p><b style="color:#10a5c8">Email:</b> <a href="mailto:${contact.email}" style="color:#3b82f6">${contact.email}</a></p>
          ${contact.phone ? `<p><b style="color:#10a5c8">Phone:</b> ${contact.phone}</p>` : ""}
          ${contact.subject ? `<p><b style="color:#10a5c8">Subject:</b> ${contact.subject}</p>` : ""}
          <p><b style="color:#10a5c8">Status:</b> ${contact.status}</p>
          <p><b style="color:#10a5c8">Submitted:</b> ${new Date(contact.created_at).toLocaleString("en-IN")}</p>
          <hr style="border-color:#1e2a3a;margin:12px 0"/>
          <p style="color:#c0cfe0;word-break:break-word">${contact.message}</p>
        </div>`,
      confirmButtonColor: "#1088ff",
      confirmButtonText: "Close",
    });
  };

  /* ── Status change ── */
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus);
      setData((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      );
    } catch {
      Swal.fire({
        ...swalDark,
        icon: "error",
        title: "Failed",
        text: "Could not update status.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  /* ── Delete single ── */
  const handleDelete = async (contact) => {
    const result = await Swal.fire({
      ...swalDark,
      title: "Delete Contact?",
      html: `<b>#${contact.id}</b> from <b>${contact.name}</b>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteContact(contact.id);
      setData((prev) => prev.filter((c) => c.id !== contact.id));
      Swal.fire({
        ...swalDark,
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        ...swalDark,
        icon: "error",
        title: "Error",
        text: "Failed to delete contact.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  /* ── Bulk delete ── */
  const handleBulkDelete = async () => {
    const selected = table.getSelectedRowModel().rows;
    if (!selected.length) {
      return Swal.fire({
        ...swalDark,
        icon: "info",
        title: "No Selection",
        text: "Select at least one row.",
        confirmButtonColor: "#3b82f6",
      });
    }
    const ids = selected.map((r) => r.original.id);
    const result = await Swal.fire({
      ...swalDark,
      title: `Delete ${ids.length} Contact${ids.length > 1 ? "s" : ""}?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      await Promise.all(ids.map(deleteContact));
      setData((prev) => prev.filter((c) => !ids.includes(c.id)));
      setRowSelection({});
      Swal.fire({
        ...swalDark,
        icon: "success",
        title: "Deleted!",
        text: `${ids.length} removed.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        ...swalDark,
        icon: "error",
        title: "Error",
        text: "Bulk delete failed.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  /* ── Columns ── */
  const baseColumns = getContactColumns(
    handleDelete,
    handleStatusChange,
    handleView,
  );
  const columns = [
    {
      id: "select",
      size: 40,
      header: ({ table }) => (
        <input
          type="checkbox"
          title="Select All"
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

  /* ── Table instance ── */
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
      sorting: [{ id: "id", desc: true }],
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

  /* ── Smart page-size dropdown positioning ── */
  const handleToggleDropdown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const openUp = window.innerHeight - rect.bottom < 140;
    setDropdownStyle({
      left: rect.left,
      top: openUp ? rect.top - 140 : rect.bottom + 5,
    });
    setPageSizeOpen((p) => !p);
  };

  /* ── Stats ── */
  const stats = countByStatus(data);

  return (
    <>
      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={`${styles.statCard} ${styles.statNew}`}>
          <span className={styles.statNum}>{stats.new}</span>
          <span className={styles.statLabel}>New</span>
        </div>
        <div className={`${styles.statCard} ${styles.statRead}`}>
          <span className={styles.statNum}>{stats.read}</span>
          <span className={styles.statLabel}>Read</span>
        </div>
        <div className={`${styles.statCard} ${styles.statReplied}`}>
          <span className={styles.statNum}>{stats.replied}</span>
          <span className={styles.statLabel}>Replied</span>
        </div>
      </div>

      {/* ── HEADER BAR ── */}
      <div className={styles.headerBar}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-envelope" /> Contact Us
        </h1>

        <div className={styles.searchContainer}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
          <input
            className={styles.searchBox}
            placeholder="Search name, email, subject…"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            title="Search name, email, subject, message, status"
          />
        </div>

        <div className={styles.rowSelections} title="Selected rows">
          <span className={styles.rowSelLabel}>Selected</span>
          <span
            className={`${styles.rowSelCount} ${
              Object.keys(rowSelection).length > 0 ? styles.rowSelActive : ""
            }`}
          >
            {Object.keys(rowSelection).length}
          </span>
        </div>

        <button
          onClick={handleBulkDelete}
          disabled={Object.keys(rowSelection).length === 0}
          className={`${styles.bulkDeleteBtn} ${
            Object.keys(rowSelection).length === 0 ? styles.disabledBtn : ""
          }`}
          title="Delete selected rows"
        >
          <i className="fa-solid fa-trash" /> Bulk Delete
        </button>

        {/* Column visibility toggle */}
        <div className={styles.columnToggle} title="Toggle columns">
          <details>
            <summary>
              <i className="fa-solid fa-sliders" />
            </summary>
            <div className={styles.dropdownMenu}>
              {table.getAllLeafColumns().map((col) => (
                <label key={col.id} className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={col.getToggleVisibilityHandler()}
                  />
                  {col.columnDef.header}
                </label>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize(), position: "relative" }}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("colId", header.column.id)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const from = e.dataTransfer.getData("colId");
                      const to = header.column.id;
                      const order = table.getAllLeafColumns().map((c) => c.id);
                      const fi = order.indexOf(from);
                      const ti = order.indexOf(to);
                      order.splice(fi, 1);
                      order.splice(ti, 0, from);
                      setColumnOrder(order);
                    }}
                  >
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
                      {header.column.getCanSort() && (
                        <span
                          className={`${styles.sortIcon} ${
                            header.column.getIsSorted() ? styles.sortActive : ""
                          }`}
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

                    {header.column.getCanFilter() && (
                      <input
                        className={styles.columnFilter}
                        placeholder="Filter…"
                        value={header.column.getFilterValue() ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}

                    <div
                      className={styles.resizer}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className={styles.tbody}>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length}>
                    <div
                      className={styles.skeletonRow}
                      style={{ animationDelay: `${i * 0.07}s` }}
                    />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  <i
                    className="fa-solid fa-envelope-open"
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                      opacity: 0.3,
                    }}
                  />
                  <p>No contacts found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.original.status === "new" ? styles.rowNew : ""}
                >
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

        {/* ── PAGINATION ── */}
        <div className={styles.paginationSection}>
          <div ref={dropdownRef}>
            <div
              className={styles.pageSizeButton}
              onClick={handleToggleDropdown}
            >
              Show {table.getState().pagination.pageSize}
              <i className="fa-solid fa-chevron-down" />
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

          <div className={styles.paginationControls}>
            {[
              {
                key: "first",
                icon: "fa-angles-left",
                label: "First",
                action: () => table.setPageIndex(0),
                disabled: !table.getCanPreviousPage(),
              },
              {
                key: "prev",
                icon: "fa-chevron-left",
                label: "Prev",
                action: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              },
              {
                key: "next",
                icon: "fa-chevron-right",
                label: "Next",
                action: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              },
              {
                key: "last",
                icon: "fa-angles-right",
                label: "Last",
                action: () => table.setPageIndex(table.getPageCount() - 1),
                disabled: !table.getCanNextPage(),
              },
            ].map(({ key, icon, label, action, disabled }) => (
              <button
                key={key}
                disabled={disabled}
                className={activePageBtn === key ? styles.activeBtn : ""}
                onClick={() => {
                  action();
                  setActivePageBtn(key);
                }}
              >
                {key === "prev" || key === "first" ? (
                  <>
                    <i className={`fa-solid ${icon}`} /> {label}
                  </>
                ) : (
                  <>
                    {label} <i className={`fa-solid ${icon}`} />
                  </>
                )}
              </button>
            ))}
          </div>

          <span className={styles.pageInfo}>
            Page <b>{table.getState().pagination.pageIndex + 1}</b> /{" "}
            <b>{table.getPageCount()}</b>
          </span>
        </div>
      </div>
    </>
  );
}

export default ContactInventory;
