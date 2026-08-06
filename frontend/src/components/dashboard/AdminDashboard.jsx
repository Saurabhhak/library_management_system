// // import React, { useState, useEffect } from "react";
// // import {
// //   LineChart,
// //   BarChart,
// //   PieChart,
// //   Line,
// //   Bar,
// //   Pie,
// //   Cell,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";
// // import "../../styles/AdminDashboard.css";

// // // ═══════════════════════════════════════════════════════════════
// // // MOCK DATA SERVICE
// // // ═══════════════════════════════════════════════════════════════

// // const generateMockLibraryData = () => {
// //   // Circulation trends over 6 months for new library
// //   const circulations = [
// //     { month: "Jan", issues: 45, returns: 42, newMembers: 8 },
// //     { month: "Feb", issues: 78, returns: 75, newMembers: 12 },
// //     { month: "Mar", issues: 95, returns: 92, newMembers: 15 },
// //     { month: "Apr", issues: 130, returns: 125, newMembers: 18 },
// //     { month: "May", issues: 165, returns: 158, newMembers: 22 },
// //     { month: "Jun", issues: 210, returns: 202, newMembers: 28 },
// //   ];

// //   // Category-wise book distribution
// //   const bookCategories = [
// //     { name: "Fiction", value: 45, count: 180 },
// //     { name: "Science", value: 28, count: 112 },
// //     { name: "History", value: 15, count: 60 },
// //     { name: "Children", value: 12, count: 48 },
// //   ];

// //   // Member activity overview
// //   const members = [
// //     {
// //       id: 1,
// //       name: "Aarav Sharma",
// //       booksIssued: 5,
// //       outstanding: 2,
// //       fine: 150,
// //       status: "active",
// //     },
// //     {
// //       id: 2,
// //       name: "Priya Verma",
// //       booksIssued: 3,
// //       outstanding: 0,
// //       fine: 0,
// //       status: "active",
// //     },
// //     {
// //       id: 3,
// //       name: "Rahul Gupta",
// //       booksIssued: 4,
// //       outstanding: 1,
// //       fine: 280,
// //       status: "overdue",
// //     },
// //     {
// //       id: 4,
// //       name: "Neha Patel",
// //       booksIssued: 6,
// //       outstanding: 3,
// //       fine: 450,
// //       status: "overdue",
// //     },
// //     {
// //       id: 5,
// //       name: "Vikram Singh",
// //       booksIssued: 2,
// //       outstanding: 0,
// //       fine: 0,
// //       status: "active",
// //     },
// //   ];

// //   // Popular books
// //   const topBooks = [
// //     { title: "The Midnight Library", issues: 34, category: "Fiction" },
// //     { title: "Educated", issues: 28, category: "Biography" },
// //     { title: "Atomic Habits", issues: 25, category: "Self-Help" },
// //     { title: "Project Hail Mary", issues: 22, category: "Science Fiction" },
// //     { title: "Sapiens", issues: 19, category: "History" },
// //   ];

// //   // Book inventory summary
// //   const inventory = [
// //     { category: "Fiction", total: 180, issued: 45, available: 135 },
// //     { category: "Science", total: 112, issued: 28, available: 84 },
// //     { category: "History", total: 60, issued: 15, available: 45 },
// //     { category: "Children", total: 48, issued: 12, available: 36 },
// //   ];

// //   return {
// //     circulations,
// //     bookCategories,
// //     members,
// //     topBooks,
// //     inventory,
// //   };
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // CHAT COMPONENT
// // // ═══════════════════════════════════════════════════════════════

// // const ChatWidget = ({ role }) => {
// //   const [messages, setMessages] = useState([
// //     { id: 1, sender: "admin", text: "Hello! Any library issues today?" },
// //     { id: 2, sender: "you", text: "Just checking fine calculations." },
// //   ]);
// //   const [input, setInput] = useState("");

// //   const sendMessage = () => {
// //     if (!input.trim()) return;
// //     setMessages([
// //       ...messages,
// //       { id: messages.length + 1, sender: "you", text: input },
// //     ]);
// //     setInput("");
// //   };

// //   return (
// //     <div className="chatWidget">
// //       <div className="chatHeader">
// //         <h4>Admin Chat</h4>
// //         <span className="chatBadge">{role}</span>
// //       </div>
// //       <div className="chatMessages">
// //         {messages.map((msg) => (
// //           <div key={msg.id} className={`chatMsg ${msg.sender}`}>
// //             <p>{msg.text}</p>
// //           </div>
// //         ))}
// //       </div>
// //       <div className="chatInput">
// //         <input
// //           type="text"
// //           placeholder="Type message..."
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           onKeyPress={(e) => e.key === "Enter" && sendMessage()}
// //         />
// //         <button onClick={sendMessage}>⟶</button>
// //       </div>
// //     </div>
// //   );
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // STATS CARD COMPONENT
// // // ═══════════════════════════════════════════════════════════════

// // const StatCard = ({ icon, label, value, subtext, trend }) => (
// //   <div className="statCard">
// //     <div className="statIcon">{icon}</div>
// //     <div className="statContent">
// //       <p className="statLabel">{label}</p>
// //       <h3 className="statValue">{value}</h3>
// //       {subtext && <p className="statSubtext">{subtext}</p>}
// //     </div>
// //     {trend && (
// //       <div className={`statTrend ${trend.positive ? "positive" : "negative"}`}>
// //         {trend.positive ? "↑" : "↓"} {Math.abs(trend.percent)}%
// //       </div>
// //     )}
// //   </div>
// // );

// // // ═══════════════════════════════════════════════════════════════
// // // MAIN ADMIN DASHBOARD
// // // ═══════════════════════════════════════════════════════════════

// // function AdminDashboard() {
// //   const [role, setRole] = useState("SuperAdmin");
// //   const [activeTab, setActiveTab] = useState("overview");
// //   const [data, setData] = useState(null);
// //   const [selectedMember, setSelectedMember] = useState(null);
// //   const [fineFilter, setFineFilter] = useState("all");

// //   useEffect(() => {
// //     // Initialize mock data on mount
// //     setData(generateMockLibraryData());
// //   }, []);

// //   if (!data) return <div className="loading">Loading dashboard...</div>;

// //   const colors = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"];

// //   // Calculate totals for KPI cards
// //   const totalMembers = data.members.length;
// //   const totalBooksIssued = data.members.reduce(
// //     (sum, m) => sum + m.booksIssued,
// //     0,
// //   );
// //   const totalFines = data.members.reduce((sum, m) => sum + m.fine, 0);
// //   const overdueCount = data.members.filter(
// //     (m) => m.status === "overdue",
// //   ).length;

// //   // Filter members based on fine status
// //   const filteredMembers = data.members.filter((member) => {
// //     if (fineFilter === "all") return true;
// //     if (fineFilter === "dues") return member.fine > 0;
// //     if (fineFilter === "overdue") return member.status === "overdue";
// //     return true;
// //   });

// //   return (
// //     <div className="adminDashboard">
// //       {/* HEADER WITH ROLE SELECTOR */}
// //       <header className="dashHeader">
// //         <div className="headerLeft">
// //           <h1>📚 LibraryHub Admin</h1>
// //           <p>Professional Library Management System</p>
// //         </div>
// //         <div className="headerRight">
// //           <select
// //             value={role}
// //             onChange={(e) => setRole(e.target.value)}
// //             className="roleSelector"
// //           >
// //             <option value="SuperAdmin">🔐 SuperAdmin</option>
// //             <option value="Admin">👤 Admin</option>
// //           </select>
// //           <div className="timestamp">
// //             {new Date().toLocaleDateString("en-IN", {
// //               day: "numeric",
// //               month: "short",
// //               year: "numeric",
// //             })}
// //           </div>
// //         </div>
// //       </header>

// //       {/* NAVIGATION TABS */}
// //       <nav className="dashTabs">
// //         {[
// //           { id: "overview", label: "📊 Overview", icon: "📊" },
// //           { id: "members", label: "👥 Members", icon: "👥" },
// //           { id: "books", label: "📚 Books", icon: "📚" },
// //           { id: "fines", label: "💰 Fines", icon: "💰" },
// //         ].map((tab) => (
// //           <button
// //             key={tab.id}
// //             className={`tabBtn ${activeTab === tab.id ? "active" : ""}`}
// //             onClick={() => setActiveTab(tab.id)}
// //           >
// //             {tab.label}
// //           </button>
// //         ))}
// //       </nav>

// //       <div className="dashContent">
// //         {/* ═══════════════════════════════════════════════════════════════
// //             OVERVIEW TAB
// //             ═══════════════════════════════════════════════════════════════ */}
// //         {activeTab === "overview" && (
// //           <>
// //             {/* KPI CARDS */}
// //             <section className="kpiSection">
// //               <h2>Key Performance Indicators</h2>
// //               <div className="kpiGrid">
// //                 <StatCard
// //                   icon="👥"
// //                   label="Total Members"
// //                   value={totalMembers}
// //                   subtext="active users"
// //                   trend={{ positive: true, percent: 8 }}
// //                 />
// //                 <StatCard
// //                   icon="📕"
// //                   label="Books Issued"
// //                   value={totalBooksIssued}
// //                   subtext="current circulation"
// //                   trend={{ positive: true, percent: 15 }}
// //                 />
// //                 <StatCard
// //                   icon="⚠️"
// //                   label="Overdue Books"
// //                   value={overdueCount}
// //                   subtext="members with overdues"
// //                   trend={{ positive: false, percent: 3 }}
// //                 />
// //                 <StatCard
// //                   icon="💰"
// //                   label="Pending Fines"
// //                   value={`₹${totalFines}`}
// //                   subtext="total outstanding"
// //                   trend={{ positive: false, percent: 12 }}
// //                 />
// //               </div>
// //             </section>

// //             {/* CHARTS SECTION */}
// //             <section className="chartsSection">
// //               {/* Circulation Trends */}
// //               <div className="chartCard">
// //                 <h3>📈 Circulation Trends (Last 6 Months)</h3>
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <LineChart data={data.circulations}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                     <XAxis dataKey="month" />
// //                     <YAxis />
// //                     <Tooltip
// //                       contentStyle={{
// //                         backgroundColor: "#fff",
// //                         border: "1px solid #e5e7eb",
// //                         borderRadius: "8px",
// //                       }}
// //                     />
// //                     <Legend />
// //                     <Line
// //                       type="monotone"
// //                       dataKey="issues"
// //                       stroke="#10b981"
// //                       strokeWidth={2}
// //                       dot={{ r: 4 }}
// //                     />
// //                     <Line
// //                       type="monotone"
// //                       dataKey="returns"
// //                       stroke="#6366f1"
// //                       strokeWidth={2}
// //                       dot={{ r: 4 }}
// //                     />
// //                     <Line
// //                       type="monotone"
// //                       dataKey="newMembers"
// //                       stroke="#f59e0b"
// //                       strokeWidth={2}
// //                       dot={{ r: 4 }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>

// //               {/* Book Categories Distribution */}
// //               <div className="chartCard">
// //                 <h3>📚 Books by Category</h3>
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <PieChart>
// //                     <Pie
// //                       data={data.bookCategories}
// //                       cx="50%"
// //                       cy="50%"
// //                       labelLine={false}
// //                       label={({ name, value }) => `${name}: ${value}%`}
// //                       outerRadius={100}
// //                       fill="#8884d8"
// //                       dataKey="value"
// //                     >
// //                       {data.bookCategories.map((entry, index) => (
// //                         <Cell key={`cell-${index}`} fill={colors[index]} />
// //                       ))}
// //                     </Pie>
// //                     <Tooltip />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               </div>

// //               {/* Top Books by Issues */}
// //               <div className="chartCard">
// //                 <h3>⭐ Most Issued Books</h3>
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <BarChart
// //                     data={data.topBooks}
// //                     layout="vertical"
// //                     margin={{ left: 150 }}
// //                   >
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                     <XAxis type="number" />
// //                     <YAxis dataKey="title" type="category" width={140} />
// //                     <Tooltip
// //                       contentStyle={{
// //                         backgroundColor: "#fff",
// //                         border: "1px solid #e5e7eb",
// //                         borderRadius: "8px",
// //                       }}
// //                     />
// //                     <Bar
// //                       dataKey="issues"
// //                       fill="#10b981"
// //                       radius={[0, 8, 8, 0]}
// //                     />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </div>

// //               {/* Inventory Status */}
// //               <div className="chartCard">
// //                 <h3>📦 Inventory Status</h3>
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <BarChart data={data.inventory}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                     <XAxis dataKey="category" />
// //                     <YAxis />
// //                     <Tooltip
// //                       contentStyle={{
// //                         backgroundColor: "#fff",
// //                         border: "1px solid #e5e7eb",
// //                         borderRadius: "8px",
// //                       }}
// //                     />
// //                     <Legend />
// //                     <Bar dataKey="total" fill="#6366f1" />
// //                     <Bar dataKey="issued" fill="#f59e0b" />
// //                     <Bar dataKey="available" fill="#10b981" />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </section>

// //             {/* CHAT & QUICK ACTION */}
// //             <section className="quickSection">
// //               <ChatWidget role={role} />
// //               <div className="quickActions">
// //                 <h3>⚡ Quick Actions</h3>
// //                 <button className="actionBtn primary">➕ Add New Member</button>
// //                 <button className="actionBtn secondary">📕 Add New Book</button>
// //                 <button className="actionBtn secondary">
// //                   🔔 Send Reminders
// //                 </button>
// //                 <button className="actionBtn secondary">
// //                   📊 Generate Report
// //                 </button>
// //               </div>
// //             </section>
// //           </>
// //         )}

// //         {/* ═══════════════════════════════════════════════════════════════
// //             MEMBERS TAB
// //             ═══════════════════════════════════════════════════════════════ */}
// //         {activeTab === "members" && (
// //           <section className="membersSection">
// //             <div className="sectionHeader">
// //               <h2>Member Management</h2>
// //               <p>View and manage library member accounts</p>
// //             </div>

// //             <div className="membersList">
// //               <table className="membersTable">
// //                 <thead>
// //                   <tr>
// //                     <th>Name</th>
// //                     <th>Books Issued</th>
// //                     <th>Outstanding</th>
// //                     <th>Fine (₹)</th>
// //                     <th>Status</th>
// //                     <th>Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {data.members.map((member) => (
// //                     <tr key={member.id} className={`status-${member.status}`}>
// //                       <td className="memberName">{member.name}</td>
// //                       <td>{member.booksIssued}</td>
// //                       <td>
// //                         <span
// //                           className={`badge ${member.outstanding > 0 ? "warning" : "success"}`}
// //                         >
// //                           {member.outstanding}
// //                         </span>
// //                       </td>
// //                       <td className={member.fine > 0 ? "textDanger" : ""}>
// //                         {member.fine > 0 ? `₹${member.fine}` : "—"}
// //                       </td>
// //                       <td>
// //                         <span className={`status ${member.status}`}>
// //                           {member.status}
// //                         </span>
// //                       </td>
// //                       <td>
// //                         <button
// //                           className="linkBtn"
// //                           onClick={() => setSelectedMember(member)}
// //                         >
// //                           View
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {selectedMember && (
// //               <div className="memberDetailModal">
// //                 <div className="modalContent">
// //                   <button
// //                     className="closeBtn"
// //                     onClick={() => setSelectedMember(null)}
// //                   >
// //                     ✕
// //                   </button>
// //                   <h3>{selectedMember.name}</h3>
// //                   <div className="detailGrid">
// //                     <div className="detailItem">
// //                       <span>Books Issued:</span>
// //                       <strong>{selectedMember.booksIssued}</strong>
// //                     </div>
// //                     <div className="detailItem">
// //                       <span>Outstanding:</span>
// //                       <strong>{selectedMember.outstanding}</strong>
// //                     </div>
// //                     <div className="detailItem">
// //                       <span>Fine Amount:</span>
// //                       <strong className="textDanger">
// //                         ₹{selectedMember.fine}
// //                       </strong>
// //                     </div>
// //                     <div className="detailItem">
// //                       <span>Status:</span>
// //                       <strong>{selectedMember.status}</strong>
// //                     </div>
// //                   </div>
// //                   <div className="modalActions">
// //                     <button className="btnPrimary">Send Reminder</button>
// //                     <button className="btnSecondary">Edit Member</button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </section>
// //         )}

// //         {/* ═══════════════════════════════════════════════════════════════
// //             BOOKS TAB
// //             ═══════════════════════════════════════════════════════════════ */}
// //         {activeTab === "books" && (
// //           <section className="booksSection">
// //             <div className="sectionHeader">
// //               <h2>Book & Catalog Management</h2>
// //               <p>View inventory by category</p>
// //             </div>

// //             <div className="booksGrid">
// //               {data.inventory.map((item, idx) => (
// //                 <div key={idx} className="bookCategoryCard">
// //                   <div className="categoryIcon">
// //                     {["📕", "🔬", "📜", "👶"][idx]}
// //                   </div>
// //                   <h3>{item.category}</h3>
// //                   <div className="categoryStats">
// //                     <div className="stat">
// //                       <p className="statNum">{item.total}</p>
// //                       <p className="statLabel">Total</p>
// //                     </div>
// //                     <div className="stat">
// //                       <p className="statNum" style={{ color: "#f59e0b" }}>
// //                         {item.issued}
// //                       </p>
// //                       <p className="statLabel">Issued</p>
// //                     </div>
// //                     <div className="stat">
// //                       <p className="statNum" style={{ color: "#10b981" }}>
// //                         {item.available}
// //                       </p>
// //                       <p className="statLabel">Available</p>
// //                     </div>
// //                   </div>
// //                   <div className="progressBar">
// //                     <div
// //                       className="progressFill"
// //                       style={{
// //                         width: `${(item.issued / item.total) * 100}%`,
// //                       }}
// //                     />
// //                   </div>
// //                   <p className="progressText">
// //                     {Math.round((item.issued / item.total) * 100)}% in
// //                     circulation
// //                   </p>
// //                 </div>
// //               ))}
// //             </div>

// //             <div className="topBooksSection">
// //               <h3>Popular Titles This Month</h3>
// //               <div class  Name="topBooksList">
// //                 {data.topBooks.map((book, idx) => (
// //                   <div key={idx} className="topBookItem">
// //                     <span className="rank">{idx + 1}</span>
// //                     <div className="bookInfo">
// //                       <h4>{book.title}</h4>
// //                       <p>{book.category}</p>
// //                     </div>
// //                     <div className="issueCount">{book.issues} issues</div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </section>
// //         )}

// //         {/* ═══════════════════════════════════════════════════════════════
// //             FINES TAB
// //             ═══════════════════════════════════════════════════════════════ */}
// //         {activeTab === "fines" && (
// //           <section className="finesSection">
// //             <div className="sectionHeader">
// //               <h2>Fine Management & Collection</h2>
// //               <p>Track and manage member fines</p>
// //             </div>

// //             <div className="filterGroup">
// //               <button
// //                 className={`filterBtn ${fineFilter === "all" ? "active" : ""}`}
// //                 onClick={() => setFineFilter("all")}
// //               >
// //                 All Members
// //               </button>
// //               <button
// //                 className={`filterBtn ${fineFilter === "dues" ? "active" : ""}`}
// //                 onClick={() => setFineFilter("dues")}
// //               >
// //                 With Dues
// //               </button>
// //               <button
// //                 className={`filterBtn ${fineFilter === "overdue" ? "active" : ""}`}
// //                 onClick={() => setFineFilter("overdue")}
// //               >
// //                 Overdue
// //               </button>
// //             </div>

// //             <div className="finesSummary">
// //               <div className="fineStat">
// //                 <h4>Total Pending Fines</h4>
// //                 <p className="fineAmount">
// //                   ₹{filteredMembers.reduce((sum, m) => sum + m.fine, 0)}
// //                 </p>
// //               </div>
// //               <div className="fineStat">
// //                 <h4>Members with Dues</h4>
// //                 <p className="fineAmount">
// //                   {filteredMembers.filter((m) => m.fine > 0).length}
// //                 </p>
// //               </div>
// //               <div className="fineStat">
// //                 <h4>Collected This Month</h4>
// //                 <p className="fineAmount">₹2,450</p>
// //               </div>
// //             </div>

// //             <table className="finesTable">
// //               <thead>
// //                 <tr>
// //                   <th>Member Name</th>
// //                   <th>Outstanding Books</th>
// //                   <th>Fine Amount (₹)</th>
// //                   <th>Days Overdue</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredMembers.map((member) => (
// //                   <tr key={member.id} className="fineRow">
// //                     <td className="memberName">{member.name}</td>
// //                     <td>{member.outstanding}</td>
// //                     <td>
// //                       <span
// //                         className={
// //                           member.fine > 0 ? "fineBadge danger" : "fineBadge"
// //                         }
// //                       >
// //                         ₹{member.fine}
// //                       </span>
// //                     </td>
// //                     <td>
// //                       {member.status === "overdue"
// //                         ? Math.floor(Math.random() * 10) + 1
// //                         : "—"}
// //                     </td>
// //                     <td>
// //                       {member.fine > 0 && (
// //                         <button className="collectBtn">Collect Fine</button>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>

// //             {filteredMembers.length === 0 && (
// //               <div className="emptyState">
// //                 <p>No fines found for selected filter</p>
// //               </div>
// //             )}
// //           </section>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default AdminDashboard;

// import { useState, useEffect } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import API from "../../api/axiosInstance";
// import { useAuth } from "../../context/AuthContext";
// import "../../styles/AdminDashboard.css";

// const COLORS = [
//   "#10b981",
//   "#6366f1",
//   "#f59e0b",
//   "#ef4444",
//   "#3b82f6",
//   "#a855f7",
// ];

// /* ── Stat card ─────────────────────────────────────────────────── */
// const StatCard = ({ icon, label, value, subtext }) => (
//   <div className="statCard">
//     <div className="statIcon">{icon}</div>
//     <div className="statContent">
//       <p className="statLabel">{label}</p>
//       <h3 className="statValue">{value}</h3>
//       {subtext && <p className="statSubtext">{subtext}</p>}
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════
//    AdminDashboard — real API data, no mocks.
//    Role comes from AuthContext (not a local dropdown anymore) —
//    the person logged in already has a fixed role from the backend.
// ══════════════════════════════════════════════════════════════ */
// function AdminDashboard() {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     API.get("/admin/dashboard/stats")
//       .then(({ data }) => {
//         if (!cancelled) setStats(data.data);
//       })
//       .catch((err) => {
//         if (!cancelled)
//           setError(err?.response?.data?.message || "Failed to load dashboard");
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   if (loading) return <div className="loading">Loading dashboard...</div>;

//   if (error) {
//     return (
//       <div className="adminDashboard">
//         <div className="dashContent">
//           <p className="textDanger">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const { kpis, booksByCategory, recentMembers } = stats;

//   return (
//     <div className="adminDashboard">
//       <header className="dashHeader">
//         <div className="headerLeft">
//           <h1>📚 APV Library Admin </h1>
//           <p>
//             Welcome, {user?.first_name} ({user?.role})
//           </p>
//         </div>
//         <div className="headerRight">
//           <div className="timestamp">
//             {new Date().toLocaleDateString("en-IN", {
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//             })}
//           </div>
//         </div>
//       </header>

//       <div className="dashContent">
//         {/* ── KPI CARDS ── */}
//         <section className="kpiSection">
//           <h2>Key Performance Indicators</h2>
//           <div className="kpiGrid">
//             <StatCard
//               icon="👥"
//               label="Total Members"
//               value={kpis.totalMembers}
//               subtext="registered"
//             />
//             <StatCard
//               icon="✅"
//               label="Active Members"
//               value={kpis.activeMembers}
//             />
//             <StatCard
//               icon="📕"
//               label="Books Issued"
//               value={kpis.totalBooksIssued}
//               subtext="currently out"
//             />
//             <StatCard icon="⚠️" label="Overdue" value={kpis.overdueCount} />
//             <StatCard icon="📚" label="Total Books" value={kpis.totalBooks} />
//             <StatCard icon="🛡️" label="Admins" value={kpis.totalAdmins} />
//           </div>
//         </section>

//         {/* ── CATEGORY CHART (real data, empty-state if no books yet) ── */}
//         <section className="chartsSection">
//           <div className="chartCard">
//             <h3>📚 Books by Category</h3>
//             {booksByCategory.length === 0 ? (
//               <p className="emptyState">
//                 No categories yet — add books to see this chart.
//               </p>
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={booksByCategory}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ category, count }) => `${category}: ${count}`}
//                     outerRadius={100}
//                     dataKey="count"
//                     nameKey="category"
//                   >
//                     {booksByCategory.map((entry, index) => (
//                       <Cell
//                         key={entry.category}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </section>

//         {/* ── RECENT MEMBERS (real data) ── */}
//         <section className="membersSection">
//           <div className="sectionHeader">
//             <h2>Recently Registered Members</h2>
//             <p>Latest 5 members — full list in Member Inventory</p>
//           </div>

//           {recentMembers.length === 0 ? (
//             <p className="emptyState">No members registered yet.</p>
//           ) : (
//             <div className="membersList">
//               <table className="membersTable">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Status</th>
//                     <th>Joined</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentMembers.map((m) => (
//                     <tr key={m.id}>
//                       <td className="memberName">
//                         {m.first_name} {m.last_name}
//                       </td>
//                       <td>{m.email}</td>
//                       <td>
//                         <span className={`status ${m.status}`}>{m.status}</span>
//                       </td>
//                       <td>
//                         {m.membership_start
//                           ? new Date(m.membership_start).toLocaleDateString(
//                               "en-IN",
//                             )
//                           : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;
