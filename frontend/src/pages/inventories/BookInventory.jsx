import { useEffect, useState, useRef } from "react";
import { getBooks, deleteBook } from "../../services/books/book.service";
import styles from "./Inventory.module.css";
// import { Link } from "react-router-dom";
import { getBooksColumns } from "../../components/tables/book/bookscolumns";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Swal from "sweetalert2";

function BookInventory() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const dropdownRef = useRef(null);
  /* ---------------- FETCH Books ---------------- */
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getBooks();
        setBooks(res?.data?.data || []);
      } catch (err) {
        console.log("Failed to load books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
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
  /* ---------------- DELETE BOOKS ---------------- */
  const handleBooksDelete = async (books) => {
    const result = await Swal.fire({
      title: "Delete Books?",
      html: `
      <b>ID:</b> ${books.id} <br/>
      <b>Title:</b> ${books.title} <br/>
      <b>Author:</b> ${books.author} ${books.last_name}
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
      await deleteBook(books.id);
      setBooks((prev) => prev.filter((a) => a.id !== books.id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Books removed successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete Books",
      });
    }
  };
  /* ---------------- Get Delete Function ------------------ */
  const columns = getBooksColumns(handleBooksDelete);
  /* ---------------- TANSTACK TABLE ---------------- */
  const table = useReactTable({
    data: books,
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
  /* _________________ SMART DROPDOWN _________________ */
  const handleToggleDropdown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownHeight = 130;
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
        <h1 className={styles.title}>Books Record</h1>
        <div className={styles.searchContainer}>
          <input
            className={styles.SearchBox}
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        {/* COLUMN VISIBILITY */}
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
                          asc: <i className="fa-solid fa-arrow-up"></i>,
                          desc: <i className="fa-solid fa-arrow-down"></i>,
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
              Show {table.getState().pagination.pageSize}
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
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fa-solid fa-angles-left"></i> First
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fa-solid fa-chevron-left"></i> Prev
            </button>

            <span className={styles.pageInfo}>
              Page <b>{table.getState().pagination.pageIndex + 1}</b> of{" "}
              <b>{table.getPageCount()}</b>
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <i className="fa-solid fa-chevron-right"></i>
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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
export default BookInventory;
