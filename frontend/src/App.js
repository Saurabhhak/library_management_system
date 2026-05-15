import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./pages/resources/ScrollToTop";

/* ── Layouts ── */
import HomeLayout from "./components/layout/HomeLayout";

/* ── Navbar (rendered outside Routes — same pattern as Footer) ── */
import NavbarSection from "./components/layout/Navbar";

/* ── Route Guards ── */
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute"; // admin + superadmin
import SuperAdminRoute from "./routes/SuperAdminRoute"; // superadmin only

/* ── Auth ── */
import AdminLoginForm from "./pages/auth/AdminLogin";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

/* ── Inventories ── */
import MemberInventory from "./pages/inventories/MemberInventory";
import AdminInventory from "./pages/inventories/AdminInventory";
import BookInventory from "./pages/inventories/BookInventory";
import CategoryInventory from "./pages/inventories/CategoryInventory";
import FeedbackInventory from "./pages/inventories/FeedbackInventory";

/* ── Admin ── */
import CreateAdmin from "./pages/admin/CreateAdmin";
import UpdateAdmin from "./pages/admin/UpdateAdmin";

/* ── Analytics ── */
import AdminPage from "./pages/analytics/admin/AdminPage";
import BookChartPage from "./pages/analytics/book/BookChartPage";
import CategoryPage from "./pages/analytics/categories/CategoryPage";
import MemberPage from "./pages/analytics/members/MemberPage";

/* ── Core Pages ── */
import Profile from "./pages/profile/Profile";
import Settings from "./settings/Settings";
import Home from "./pages/home/Home";

/* ── Books ── */
import CreateBook from "./pages/library/books/CreateBook";
import UpdateBook from "./pages/library/books/UpdateBook";

/* ── Transactions ── */
import IssueBook from "./pages/library/transactions/IssueBook";

/* ── Categories ── */
import UpdateCategory from "./pages/library/categories/UpdateCategory";
import AddCategory from "./pages/library/categories/AddCategory";

/* ── History ── */
import History from "./pages/history/History";

/* ── Members ── */
import MemberLogin from "./pages/members/auth/Memberlogin";
import CreateMember from "./pages/members/CreateMember";
import UpdateMember from "./pages/members/UpdateMember";

/* ── Library ── */
import BooksLib from "./pages/library/library/Bookslib";
import Authors from "./pages/library/library/Authors";

/* ── Resources & Legal ── */
import Documentation from "./pages/resources/Documentation";
import ApiReference from "./pages/resources/ApiReference";
import Changelog from "./pages/resources/Changelog";
import HelpCenter from "./pages/resources/HelpCenter";
import StatusPage from "./pages/resources/StatusPage";
import Privacy from "./pages/home/Privacy";
import Terms from "./pages/home/Terms";
import Cookies from "./pages/home/Cookies";
import Footer from "./pages/home/Footer";
import FeedbackPage from "./pages/resources/FeedbackPage";
import ContactUs from "./pages/resources/ContactUs";

/* ── 404 ── */
import NotFound from "./pages/errors/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      {/*
       * NavbarSection sits OUTSIDE <Routes> — exactly like <Footer>.
       * NavbarSection internally checks localStorage for a valid token
       * and returns null when the user is not authenticated, so it is
       * invisible on /login, /forgot-password, etc.
       */}
      <NavbarSection />

      <Routes>
        {/* ── 1. Public standalone — accessible by EVERYONE ────────────────
         *   Public users  → see CreateMember without any layout
         *   Authenticated → PrivateRoute version below wins (more-specific
         *     nested match) and renders with HomeLayout + sidebar
         * ──────────────────────────────────────────────────────────────── */}
        <Route path="/createmember" element={<CreateMember />} />

        {/* ── 2. Public auth routes (redirect away when already logged in) ── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AdminLoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/memberlogin" element={<MemberLogin />} />
        </Route>

        {/* ── 3. Protected — any authenticated role ─────────────────────── */}
        <Route element={<PrivateRoute />}>
          <Route element={<HomeLayout />}>
            {/* ── Dashboard
             *   Home component itself inspects the role and redirects members
             *   to /library if they should not see the admin dashboard.
             * ──────────────────────────────────────────────────────────── */}
            <Route path="/" element={<Home />} />

            {/* ── All-role routes (superadmin + admin + member) ─────────── */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/library" element={<BooksLib />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/history" element={<History />} />

            {/* Legacy redirects */}
            <Route
              path="/bookslib"
              element={<Navigate to="/library" replace />}
            />
            <Route
              path="/hightRatingBooks"
              element={<Navigate to="/library?filter=trending" replace />}
            />

            {/* ── Admin + SuperAdmin only ───────────────────────────────── */}
            <Route element={<AdminRoute />}>
              {/* Create Member (with HomeLayout for admins) */}
              <Route path="/createmember" element={<CreateMember />} />

              {/* Books */}
              <Route path="/bookinventory" element={<BookInventory />} />
              <Route path="/createbook" element={<CreateBook />} />
              <Route path="/updatebook/:id" element={<UpdateBook />} />
              <Route path="/bookchartpage" element={<BookChartPage />} />

              {/* Categories */}
              <Route
                path="/categoryinventory"
                element={<CategoryInventory />}
              />
              <Route path="/addcategory" element={<AddCategory />} />
              <Route path="/updatecategory/:id" element={<UpdateCategory />} />
              <Route path="/categorypage" element={<CategoryPage />} />

              {/* Members management */}
              <Route path="/memberinventory" element={<MemberInventory />} />
              <Route path="/updatemember/:id" element={<UpdateMember />} />
              <Route path="/memberpage" element={<MemberPage />} />

              {/* Transactions */}
              <Route path="/issuebook" element={<IssueBook />} />

              {/* Feedback */}
              <Route
                path="/feedbackinventory"
                element={<FeedbackInventory />}
              />
              <Route path="/feedback-page" element={<FeedbackPage />} />

              {/* Resources */}
              <Route path="/docs" element={<Documentation />} />
              <Route path="/api-reference" element={<ApiReference />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/contact-us" element={<ContactUs />} />

              {/* Legal */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
            </Route>

            {/* ── SuperAdmin only ───────────────────────────────────────── */}
            <Route element={<SuperAdminRoute />}>
              <Route path="/createadmin" element={<CreateAdmin />} />
              <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
              <Route path="/admininventory" element={<AdminInventory />} />
              <Route path="/adminpage" element={<AdminPage />} />
            </Route>

            {/* ── Authenticated 404 — stays inside the layout ──────────── */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* ── 4. Public 404 — outside layout ───────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer rendered on every page — same as NavbarSection pattern */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
