import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Layout */
import HomeLayout from "./components/layout/HomeLayout";

/* Route guards */
import PrivateRoute from "./routes/PrivateRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";

/* Auth + Setup pages  (ALL PUBLIC) */
import Setup from "./pages/auth/Setup"; // ← /setup  NEW
import AdminLoginForm from "./pages/auth/AdminLogin";
import AcceptInvite from "./pages/auth/AcceptInvite";
import GoogleSuccess from "./pages/auth/GoogleSuccess";
import CompleteProfile from "./pages/profile/CompleteProfile";

/* Dashboard */
import DisplayMember from "./pages/dashboard/DisplayMember";
import DisplayAdmin from "./pages/dashboard/DisplayAdmin";

/* Admin */
import CreateAdmin from "./pages/admin/CreateAdmin";
import UpdateAdmin from "./pages/admin/UpdateAdmin";

/* Charts */
import Chart from "./components/Chart";
import AdminChart from "./components/charts/AdminChart";
import AdminPage from "./pages/dashboard/AdminPage";

/* Pages */
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

/* Books */
import CreateBook from "./pages/books/book/CreateBook";
import UpdateBook from "./pages/books/book/UpdateBook";
import Books from "./pages/books/BooksLayout";
import BookInventory from "./pages/books/BookInventory";
import IssueBook from "./pages/books/IssueBook";
import Bookslib from "./pages/books/Bookslib";
import Category from "./pages/books/Category";
import CategoryInventory from "./pages/books/CategoryInventory";

/* History */
import History from "./pages/history/History";

/* Members */
import CreateMember from "./pages/members/CreateMember";
import UpdateMember from "./pages/members/UpdateMember";
import MemberPage from "./pages/members/MemberPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ══════════════════════════════════════════════════════
            PUBLIC ROUTES  — no token needed
            ══════════════════════════════════════════════════════ */}

        {/* First-time setup — self-disables after superadmin created */}
        <Route path="/setup" element={<Setup />} />

        {/* Normal login */}
        <Route path="/login" element={<AdminLoginForm />} />

        {/* Google OAuth landing — saves token then redirects */}
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* Invite flow — invited admin clicks email link */}
        <Route path="/accept-invite/:token" element={<AcceptInvite />} />

        {/* Complete profile after invite Google login */}
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* ══════════════════════════════════════════════════════
            PRIVATE ROUTES — valid JWT required
            PrivateRoute checks token exists + not expired
            ══════════════════════════════════════════════════════ */}
        <Route element={<PrivateRoute />}>
          {/* SuperAdmin-only */}
          <Route
            path="/createadmin"
            element={
              <SuperAdminRoute>
                <CreateAdmin />
              </SuperAdminRoute>
            }
          />

          {/* All authenticated admins */}
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />

            {/* Admin management */}
            <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
            <Route path="/displayadmin" element={<DisplayAdmin />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Charts */}
            <Route path="/chart" element={<Chart />} />
            <Route path="/adminchart" element={<AdminChart />} />
            <Route path="/adminpage" element={<AdminPage />} />

            {/* Books */}
            <Route path="/createbook" element={<CreateBook />} />
            <Route path="/updatebook/:id" element={<UpdateBook />} />
            <Route path="/bookinventory" element={<BookInventory />} />
            <Route element={<Books />} />
            <Route path="/issuebook" element={<IssueBook />} />
            <Route path="/bookslib" element={<Bookslib />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/categoryinventory" element={<CategoryInventory />} />

            {/* History */}
            <Route path="/history" element={<History />} />

            {/* Members */}
            <Route path="/createmember" element={<CreateMember />} />
            <Route path="/updatemember/:id" element={<UpdateMember />} />
            <Route path="/displaymember" element={<DisplayMember />} />
            <Route path="/memberpage" element={<MemberPage />} />
          </Route>
        </Route>

        {/* ══════════════════════════════════════════════════════
            404
            ══════════════════════════════════════════════════════ */}
        <Route
          path="*"
          element={
            <div
              style={{
                textAlign: "center",
                marginTop: "6rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                fontFamily: "sans-serif",
              }}
            >
              <span style={{ fontSize: "4rem" }}>
                <i className="fa-solid fa-face-sad-tear" />
              </span>
              <h1 style={{ margin: 0 }}>404 — Page Not Found</h1>
              <p>The page you are looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
