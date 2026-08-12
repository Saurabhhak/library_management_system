import { useState, useEffect, useMemo } from "react";
import styles from "./MemberInventory.module.css";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
// import { getMembers, deleteMember, updateMemberStatus } from "../../services/admin/member.service"; // Adjust API

const swalDark = { background: "#0d1117", color: "#d9edff" };

export default function MemberInventory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  /* ── Fetch Data ── */
  const fetchMembers = async () => {
    setLoading(true);
    try {
      // const res = await getMembers();
      // setData(res?.data?.data || []);

      // Dummy data for visual test based on your screenshot
      setTimeout(() => {
        setData([
          {
            id: 8,
            first_name: "Test",
            last_name: "User",
            type: "Guest",
            email: "extremehaker007@gmail.com",
            phone: "9193142045",
            state: "Delhi",
            city: "New Delhi",
            status: "active",
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Fetch failed:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* ── Handlers ── */
  const handleDelete = async (id, name) => {
    const confirm = await Swal.fire({
      ...swalDark,
      title: `Delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });
    if (confirm.isConfirmed) {
      // await deleteMember(id);
      setData((prev) => prev.filter((u) => u.id !== id));
      Swal.fire({
        ...swalDark,
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((r) => r.original.id);
    if (!selectedIds.length) return;
    const confirm = await Swal.fire({
      ...swalDark,
      title: `Delete ${selectedIds.length} members?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete All",
      confirmButtonColor: "#ef4444",
    });
    if (confirm.isConfirmed) {
      // await Promise.all(selectedIds.map(id => deleteMember(id)));
      setData((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setRowSelection({});
      Swal.fire({
        ...swalDark,
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  /* ── Columns ── */
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 40,
      },
      { accessorKey: "id", header: "ID ↑", size: 60 },
      { accessorKey: "first_name", header: "First Name ↕" },
      { accessorKey: "last_name", header: "Last Name ↕" },
      {
        accessorKey: "type",
        header: "Type ↕",
        cell: ({ getValue }) => (
          <span style={{ color: "#94a3b8" }}>{getValue()}</span>
        ),
      },
      { accessorKey: "email", header: "Email ↕" },
      { accessorKey: "phone", header: "Phone ↕" },
      { accessorKey: "state", header: "State ↕" },
      { accessorKey: "city", header: "City ↕" },
      {
        accessorKey: "status",
        header: "Status ↕",
        cell: ({ getValue }) => (
          <span className={styles.statusActive}>{getValue()}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className={styles.actionBtns}>
            <button title="View" className={styles.actionIcon}>
              <i className="fa-solid fa-user" />
            </button>
            <button
              title="Delete"
              className={styles.actionIconDel}
              onClick={() =>
                handleDelete(row.original.id, row.original.first_name)
              }
            >
              <i className="fa-solid fa-trash" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  /* ── Table Instance ── */
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className={styles.pageWrapper}>
      {/* ── HEADER ── */}
      <div className={styles.headerBar}>
        <h1 className={styles.title}>
          <i
            className="fa-solid fa-users"
            style={{ color: "#10b981", marginRight: "8px" }}
          />{" "}
          Members
        </h1>

        <div className={styles.toolbar}>
          <button className={styles.btnOutline}>
            <i className="fa-solid fa-user-plus" /> Member
          </button>
          <button className={styles.btnOutline}>
            <i className="fa-solid fa-chart-line" /> Charts
          </button>

          <div className={styles.searchContainer}>
            <i
              className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}
            />
            <input
              className={styles.searchBox}
              placeholder="Search ID, name, email, city..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          <span className={styles.selCount}>
            Selected {Object.keys(rowSelection).length}
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={!Object.keys(rowSelection).length}
            className={styles.bulkDelBtn}
          >
            <i className="fa-solid fa-trash" /> Bulk Delete
          </button>
          <button className={styles.btnOutline}>
            <i className="fa-solid fa-sliders" />
          </button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    style={{ width: h.getSize() }}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles.tbody}>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length}>
                    <div className={styles.skeletonRow} />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  No members found
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
        <div className={styles.pagination}>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className={styles.pageSelect}
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>
                Show {s}
              </option>
            ))}
          </select>
          <div className={styles.pageControls}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              « First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹ Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next ›
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last »
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount() || 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
