// import { useEffect, useState } from "react";
// import { getMyTransactions } from "../../services/transactions/transactionService"; 
// import styles from "./MemberDashboard.module.css"; 

// export default function MyBorrowings() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getMyTransactions()
//       .then((res) => setTransactions(res?.data?.data || []))
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   const getStatusBadge = (status, dueDate) => {
//     if (status === "returned")
//       return (
//         <span className={`${styles.badge} ${styles.badgeSuccess}`}>
//           Returned
//         </span>
//       );
//     if (new Date(dueDate) < new Date())
//       return (
//         <span className={`${styles.badge} ${styles.badgeDanger}`}>Overdue</span>
//       );
//     return (
//       <span className={`${styles.badge} ${styles.badgeWarning}`}>Issued</span>
//     );
//   };

//   return (
//     <div className={styles.page}>
//       <header className={`${styles.headerBar} ${styles.fadeUp}`}>
//         <h1 className={styles.title}>
//           <i className="fa-solid fa-book-bookmark" /> My Borrowings History
//         </h1>
//         <p className={styles.subText}>
//           Track your issued books, due dates, and outstanding fines.
//         </p>
//       </header>

//       <div
//         className={`${styles.tableWrapper} ${styles.fadeUp}`}
//         style={{ animationDelay: "0.2s" }}
//       >
//         <table className={styles.table}>
//           <thead className={styles.thead}>
//             <tr>
//               <th>Book Title</th>
//               <th>Issue Date</th>
//               <th>Due Date</th>
//               <th>Return Date</th>
//               <th>Status</th>
//               <th>Fine Amount</th>
//             </tr>
//           </thead>
//           <tbody className={styles.tbody}>
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className={styles.emptyCell}>
//                   <i className="fa-solid fa-spinner fa-spin" /> Loading
//                   history...
//                 </td>
//               </tr>
//             ) : transactions.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className={styles.emptyCell}>
//                   <i
//                     className="fa-solid fa-folder-open"
//                     style={{ fontSize: "2rem", opacity: 0.5 }}
//                   />
//                   <p>You haven't borrowed any books yet.</p>
//                 </td>
//               </tr>
//             ) : (
//               transactions.map((tx) => (
//                 <tr key={tx.id}>
//                   <td style={{ fontWeight: 600, color: "#f8fafc" }}>
//                     {tx.book_title}
//                   </td>
//                   <td>{new Date(tx.issue_date).toLocaleDateString("en-IN")}</td>
//                   <td style={{ color: "#3b82f6" }}>
//                     {new Date(tx.due_date).toLocaleDateString("en-IN")}
//                   </td>
//                   <td>
//                     {tx.return_date
//                       ? new Date(tx.return_date).toLocaleDateString("en-IN")
//                       : "-"}
//                   </td>
//                   <td>{getStatusBadge(tx.status, tx.due_date)}</td>
//                   <td
//                     style={{
//                       color: tx.fine > 0 ? "#ef4444" : "#10b981",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {tx.fine > 0 ? `₹${tx.fine}` : "No Fine"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
