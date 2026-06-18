import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* ── Scroll System (3 pieces that work together) ── */
import { ScrollProvider } from "./components/layout/ScrollContext";
import ScrollToTop from "./components/layout/ScrollTotop";
import ScrollToTopButton from "./components/layout/Scrolltotopbutton";

/* ── Layouts ── */
import HomeLayout from "./components/layout/HomeLayout";
import NavbarSection from "./components/layout/Navbar";

/* ── Route Guards ── */
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import LandingRoute from "./routes/Landingroute";

/* ── Landing Page ── */
import Landing from "./pages/home/Landing";

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
import ContactInventory from "./pages/inventories/ContactInventory";

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

/**
 * AppShell
 *
 * Why this exists: useLocation() only works INSIDE <BrowserRouter>.
 * App() itself renders <BrowserRouter>, so the path-reading logic has
 * to live in a child component rendered underneath it — that's AppShell.
 */
function AppShell() {
  const location = useLocation();

  // Add any other paths here that should also hide the global footer
  // (e.g. login/signup full-screen pages) — just extend this array.
  const hideFooterOn = ["/"];
  const showFooter = !hideFooterOn.includes(location.pathname);

  return (
    <>
      {/* Resets scroll on every route change */}
      <ScrollToTop />

      {/* Floating back-to-top button — visible globally */}
      <ScrollToTopButton />

      <NavbarSection />

      <Routes>
        <Route element={<LandingRoute />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* ── Public standalone ── */}
        <Route path="/createmember" element={<CreateMember />} />

        {/* ── Public auth routes ── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AdminLoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/memberlogin" element={<MemberLogin />} />
        </Route>

        {/* ── Protected — any authenticated role ── */}
        <Route element={<PrivateRoute />}>
          <Route element={<HomeLayout />}>
            <Route path="/home" element={<Home />} />
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

            {/* ── Admin + SuperAdmin ── */}
            <Route element={<AdminRoute />}>
              <Route path="/createmember" element={<CreateMember />} />
              <Route path="/bookinventory" element={<BookInventory />} />
              <Route path="/createbook" element={<CreateBook />} />
              <Route path="/updatebook/:id" element={<UpdateBook />} />
              <Route path="/bookchartpage" element={<BookChartPage />} />
              <Route
                path="/categoryinventory"
                element={<CategoryInventory />}
              />
              <Route path="/addcategory" element={<AddCategory />} />
              <Route path="/updatecategory/:id" element={<UpdateCategory />} />
              <Route path="/categorypage" element={<CategoryPage />} />
              <Route path="/memberinventory" element={<MemberInventory />} />
              <Route path="/updatemember/:id" element={<UpdateMember />} />
              <Route path="/memberpage" element={<MemberPage />} />
              <Route path="/issuebook" element={<IssueBook />} />
              <Route
                path="/feedbackinventory"
                element={<FeedbackInventory />}
              />
              <Route path="/feedback-page" element={<FeedbackPage />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/api-reference" element={<ApiReference />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/contact-inventory" element={<ContactInventory />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
            </Route>

            {/* ── SuperAdmin only ── */}
            <Route element={<SuperAdminRoute />}>
              <Route path="/createadmin" element={<CreateAdmin />} />
              <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
              <Route path="/admininventory" element={<AdminInventory />} />
              <Route path="/adminpage" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Landing page has its own footer built in (see Landing.jsx),
          so the global Footer is skipped there to avoid showing twice. */}
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    /*
     * ScrollProvider wraps EVERYTHING — must be outermost.
     * It holds the ref to the scrollable container inside HomeLayout.
     */
    <ScrollProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ScrollProvider>
  );
}

export default App;
