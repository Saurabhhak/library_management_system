import { useState, useEffect, useMemo } from "react";
import styles from "./DeletedInventory.module.css";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";

// Apna service import verify kar lein
import {
  getDeletedAdmins,
  restoreAdmin,
} from "../../services/admin/admin.service";

const swalDark = { background: "#0d1117", color: "#d9edff" };

export default function DeletedAccountsInventory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  /* ── Fetch Data ── */
  const fetchDeleted = async () => {
    setLoading(true);
    try {
      const res = await getDeletedAdmins();
      setData(res?.data?.data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
      Swal.fire({
        ...swalDark,
        icon: "error",
        title: "Connection Error",
        text: "Could not fetch deleted accounts.",
        confirmButtonColor: "#ef4444",
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  /* ── Restore Handler ── */
  const handleRestore = async (id, name) => {
    const confirm = await Swal.fire({
      ...swalDark,
      title: `Restore ${name}?`,
      text: "This account will be active again and the user can log in.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Restore",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#334155",
    });

    if (confirm.isConfirmed) {
      try {
        await restoreAdmin(id);
        setData((prev) => prev.filter((user) => user.id !== id));
        Swal.fire({
          ...swalDark,
          icon: "success",
          title: "Restored!",
          text: `${name}'s account is active again.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          ...swalDark,
          icon: "error",
          title: "Failed",
          text: "Could not restore the account.",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  /* ── Columns Definition ── */
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "User Name",
        cell: ({ row }) => (
          <div style={{ fontWeight: "600", color: "#d9edff" }}>
            {row.original.first_name} {row.original.last_name}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email Address",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const role = getValue();
          const isAd = ["admin", "superadmin", "staff", "librarian"].includes(
            role,
          );
          return (
            <span
              className={`${styles.badge} ${isAd ? styles.badgeAdmin : styles.badgeMember}`}
            >
              <i
                className={`fa-solid ${isAd ? "fa-shield-halved" : "fa-user"}`}
              />{" "}
              {role.toUpperCase()}
            </span>
          );
        },
      },
      {
        accessorKey: "updated_at",
        header: "Deleted On",
        cell: ({ getValue }) => (
          <span style={{ color: "#f87171", fontWeight: "500" }}>
            {new Date(getValue()).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() =>
              handleRestore(row.original.id, row.original.first_name)
            }
            className={styles.restoreBtn}
          >
            <i className="fa-solid fa-clock-rotate-left" /> Restore
          </button>
        ),
      },
    ],
    [],
  );

  /* ── Table Instance ── */
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  /* ── Stats Calculation ── */
  const total = data.length;
  const adminCount = data.filter((d) =>
    ["admin", "superadmin", "staff", "librarian"].includes(d.role),
  ).length;
  const memberCount = total - adminCount;

  return (
    <div className={styles.pageWrapper}>
      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{total}</span>
          <span className={styles.statLabel}>Total Pending</span>
        </div>
        <div className={`${styles.statCard} ${styles.statAdmin}`}>
          <span className={styles.statNum}>{adminCount}</span>
          <span className={styles.statLabel}>Staff / Admins</span>
        </div>
        <div className={`${styles.statCard} ${styles.statMember}`}>
          <span className={styles.statNum}>{memberCount}</span>
          <span className={styles.statLabel}>Members</span>
        </div>
      </div>

      {/* ── HEADER BAR ── */}
      <div className={styles.headerBar}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-trash-can-arrow-up" /> Recycle Bin
        </h1>
        <div className={styles.searchContainer}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
          <input
            className={styles.searchBox}
            placeholder="Search email, name..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} style={{ width: header.getSize() }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles.tbody}>
            {loading ? (
              // ── SHIMMER SKELETON STATE ──
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length}>
                    <div
                      className={styles.skeletonRow}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              // ── EMPTY DATA STATE (BIG UI) ──
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  <i className={`fa-solid fa-box-open ${styles.emptyIcon}`} />
                  <h3 className={styles.emptyTitle}>
                    No pending deleted accounts
                  </h3>
                  <p className={styles.emptyDesc}>
                    Accounts deleted will appear here for 15 days before
                    permanent removal.
                  </p>
                </td>
              </tr>
            ) : (
              // ── ACTUAL DATA ROWS ──
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
      </div>
    </div>
  );
}
