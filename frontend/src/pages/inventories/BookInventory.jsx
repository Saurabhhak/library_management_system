import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Inventory.module.css";
import { getBooks, deleteBook } from "../../services/books/book.service";
import { getBooksColumns } from "../../components/tables/book/bookscolumns";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

const swalDark = { background: "#0d1117", color: "#d9edff" };

function BookInventory() {
  /* ── State ── */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnSizing, setColumnSizing] = useState({});
  const [columnSizingInfo, setColumnSizingInfo] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [activePageBtn, setActivePageBtn] = useState("");
  const dropdownRef = useRef(null);

  /* ── Fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getBooks();
        setData(res?.data?.data || []);
      } catch (err) {
        console.error("Book fetch failed:", err);
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

  /* ── Delete single ── */
  const handleBooksDelete = async (book) => {
    const result = await Swal.fire({
      ...swalDark,
      title: "Delete Book?",
      html: `<b>#${book.id}</b> — ${book.title}<br/><small style="color:#7a8a9e">by ${book.author}</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteBook(book.id);
      setData((prev) => prev.filter((b) => b.id !== book.id));
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
        text: "Failed to delete book.",
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
      title: `Delete ${ids.length} Book${ids.length > 1 ? "s" : ""}?`,
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
      await Promise.all(ids.map(deleteBook));
      setData((prev) => prev.filter((b) => !ids.includes(b.id)));
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
    ...getBooksColumns(handleBooksDelete),
  ];

  /* ── Table ── */
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

  /* ── Smart dropdown position ── */
  const handleToggleDropdown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const openUp = window.innerHeight - rect.bottom < 140;
    setDropdownStyle({
      left: rect.left,
      top: openUp ? rect.top - 140 : rect.bottom + 5,
    });
    setPageSizeOpen((p) => !p);
  };

  const paginationBtns = [
    {
      key: "first",
      label: "First",
      icon: "fa-angles-left",
      action: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      iconLeft: true,
    },
    {
      key: "prev",
      label: "Prev",
      icon: "fa-chevron-left",
      action: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      iconLeft: true,
    },
    {
      key: "next",
      label: "Next",
      icon: "fa-chevron-right",
      action: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      iconLeft: false,
    },
    {
      key: "last",
      label: "Last",
      icon: "fa-angles-right",
      action: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      iconLeft: false,
    },
  ];

  const selCount = Object.keys(rowSelection).length;

  return (
    <>
      {/* ── HEADER BAR ── */}
      <div className={styles.headerBar}>
        <h1 className={styles.title} title="Books Table">
          <i className="fa-solid fa-book" /> Books
        </h1>

        <Link to="/createbook" className={styles.addBtn} title="Add Book">
          <i className="fa-solid fa-book-medical" /> Book
        </Link>

        <Link
          to="/bookchartpage"
          className={styles.chartBtn}
          title="Analytics Dashboard"
        >
          <i className="fa-solid fa-chart-line" /> Charts
        </Link>

        <div className={styles.searchContainer}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
          <input
            className={styles.SearchBox}
            placeholder="Search ID, title, author, ISBN…"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            title="Search book ID, title, author, ISBN, category, shelf location"
          />
        </div>

        <div className={styles.RowSelections} title="Selected row count">
          <span className={styles.RowSelectionTitle}>Selected</span>
          <span
            className={`${styles.selectedRow} ${selCount === 0 ? styles.CountSelectRow : ""}`}
          >
            {selCount}
          </span>
        </div>

        <button
          onClick={handleBulkDelete}
          disabled={selCount === 0}
          className={`${styles.bulkDeleteBtn} ${selCount === 0 ? styles.disabledBtn : ""}`}
          title="Delete selected rows"
        >
          <i className="fa-solid fa-trash" /> Bulk Delete
        </button>

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
                    style={{ width: header.getSize(), position: "relative" ,textTransform:"capitalize"}}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("colId", header.column.id)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const from = e.dataTransfer.getData("colId");
                      const to = header.column.id;
                      const order = table.getAllLeafColumns().map((c) => c.id);
                      const fi = order.indexOf(from),
                        ti = order.indexOf(to);
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
              [...Array(8)].map((_, i) => (
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
                  <i className="fa-solid fa-book" />
                  <p>No books found</p>
                </td>
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
                    className={`${styles.pageSizeItem} ${table.getState().pagination.pageSize === size ? styles.activeItem : ""}`}
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
            {paginationBtns.map(
              ({ key, label, icon, action, disabled, iconLeft }) => (
                <button
                  key={key}
                  disabled={disabled}
                  className={activePageBtn === key ? styles.activeBtn : ""}
                  onClick={() => {
                    action();
                    setActivePageBtn(key);
                  }}
                >
                  {iconLeft ? (
                    <>
                      <i className={`fa-solid ${icon}`} /> {label}
                    </>
                  ) : (
                    <>
                      {label} <i className={`fa-solid ${icon}`} />
                    </>
                  )}
                </button>
              ),
            )}
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

export default BookInventory;
