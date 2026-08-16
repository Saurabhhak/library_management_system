import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* ── Contexts & Scroll ── */
import { AuthProvider } from "./context/AuthContext";
import { ScrollProvider } from "./components/layout/ScrollContext";
import ScrollToTop from "./components/layout/ScrollTotop";
import ScrollToTopButton from "./components/layout/Scrolltotopbutton";

/* ── Layouts ── */
import HomeLayout from "./components/layout/HomeLayout";
import NavbarSection from "./components/layout/Navbar";
import Footer from "./pages/home/Footer";

/* ── Route Guards ── */
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import MemberRoute from "./routes/MemberRoute";
import LandingRoute from "./routes/Landingroute";

/* ── Public Pages ── */
import Landing from "./pages/home/Landing";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/* ── Dashboards ── */
import AdminDashboard from "./components/dashboard/AdminDashboard";
import MemberDashboard from "./pages/members/MemberDashboard";

/* ── Inventories ── */
import MemberInventory from "./pages/inventories/MemberInventory";
import AdminInventory from "./pages/inventories/AdminInventory";
import BookInventory from "./pages/inventories/BookInventory";
import CategoryInventory from "./pages/inventories/CategoryInventory";
import FeedbackInventory from "./pages/inventories/FeedbackInventory";
import ContactInventory from "./pages/inventories/ContactInventory";

/* ── Admin Specific ── */
import CreateAdmin from "./pages/admin/CreateAdmin";
import UpdateAdmin from "./pages/admin/UpdateAdmin";
import AdminPage from "./pages/analytics/admin/AdminPage";
import BookChartPage from "./pages/analytics/book/BookChartPage";
import CategoryPage from "./pages/analytics/categories/CategoryPage";
import MemberPage from "./pages/analytics/members/MemberPage";

/* ── Shared Authenticated Pages ── */
import Profile from "./pages/profile/Profile";
import Settings from "./settings/Settings";
import DeletedAccountsInventory from "./pages/inventories/DeletedAccountsInventory";
import Home from "./pages/home/Home";
import History from "./pages/history/History";
// import MyBorrowings from "./pages/members/MyBorrowings";

/* ── Library Management ── */
import CreateBook from "./pages/library/books/CreateBook";
import UpdateBook from "./pages/library/books/UpdateBook";
import IssueBook from "./pages/library/transactions/IssueBook";
import AddCategory from "./pages/library/categories/AddCategory";
import UpdateCategory from "./pages/library/categories/UpdateCategory";
import BooksLib from "./pages/library/library/Bookslib";
import Authors from "./pages/library/library/Authors";
import CreateMember from "./pages/members/CreateMember";
import UpdateMember from "./pages/members/UpdateMember";

/* ── Resources & Legal ── */
import Documentation from "./pages/resources/Documentation";
import ApiReference from "./pages/resources/ApiReference";
import Changelog from "./pages/resources/Changelog";
import HelpCenter from "./pages/resources/HelpCenter";
import StatusPage from "./pages/resources/StatusPage";
import FeedbackPage from "./pages/resources/FeedbackPage";
import ContactUs from "./pages/resources/ContactUs";
import Privacy from "./pages/home/Privacy";
import Terms from "./pages/home/Terms";
import Cookies from "./pages/home/Cookies";

/* ── Error Handling ── */
import NotFound from "./pages/errors/NotFound";

function AppShell() {
  const location = useLocation();
  // Hide footer only on the landing page
  const hideFooterOn = ["/"];
  const showFooter = !hideFooterOn.includes(location.pathname);

  return (
    /* THE FIX: flex-col aur min-h-screen poore app ko kam se kam full screen height dega */
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <ScrollToTopButton />
      <NavbarSection />

      {/* THE FIX: flex-grow main tag ko bachi hui space fill karne ko majboor karega. 
          Jisse Footer hamesha exactly bottom pe locked rahega, chahe beech me loader ho ya empty state. */}
      <main className="flex-grow flex flex-col w-full">
        <Routes>
          {/* ── Landing Page ── */}
          <Route element={<LandingRoute />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* ── Public Auth Routes ── */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* ── Protected Routes (Requires Login) ── */}
          <Route element={<PrivateRoute />}>
            <Route element={<HomeLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/library" element={<BooksLib />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/history" element={<History />} />

              {/* Redirections for deprecated or alternate paths */}
              <Route path="/bookslib" element={<Navigate to="/library" replace />}/>
              <Route path="/hightRatingBooks" element={<Navigate to="/library?filter=trending" replace />}/>

              {/* ── Member Only Routes ── */}
              <Route element={<MemberRoute />}>
                <Route path="/member/dashboard" element={<MemberDashboard />} />
              </Route>

              {/* ── Admin & SuperAdmin Routes ── */}
              <Route element={<AdminRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/bookinventory" element={<BookInventory />} />
                <Route path="/createbook" element={<CreateBook />} />
                <Route path="/updatebook/:id" element={<UpdateBook />} />
                <Route path="/bookchartpage" element={<BookChartPage />} />
                <Route path="/categoryinventory" element={<CategoryInventory />}/>
                <Route path="/addcategory" element={<AddCategory />} />
                <Route path="/updatecategory/:id" element={<UpdateCategory />}/>
                <Route path="/categorypage" element={<CategoryPage />} />
                <Route path="/memberinventory" element={<MemberInventory />} />
                <Route path="/memberpage" element={<MemberPage />} />
                <Route path="/createmember" element={<CreateMember />} />
                <Route path="/updatemember/:id" element={<UpdateMember />} />
                {/* <Route path="/my-borrowings" element={<MyBorrowings />} /> */}

                <Route path="/issuebook" element={<IssueBook />} />
                <Route path="/feedbackinventory" element={<FeedbackInventory />}/>
                <Route path="/feedback-page" element={<FeedbackPage />} />

                {/* Resources */}
                <Route path="/docs" element={<Documentation />} />
                <Route path="/api-reference" element={<ApiReference />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/contact-inventory" element={<ContactInventory />}/>
                <Route path="/deleted-accounts-inventory" element={<DeletedAccountsInventory />} />

                {/* Legal */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
              </Route>

              {/* ── SuperAdmin Only Routes ── */}
              <Route element={<SuperAdminRoute />}>
                <Route path="/createadmin" element={<CreateAdmin />} />
                <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
                <Route path="/admininventory" element={<AdminInventory />} />
                <Route path="/adminpage" element={<AdminPage />} />
              </Route>

              {/* Internal 404 handler inside HomeLayout */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          {/* Global 404 handler */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer apni jagah par lock rahega */}
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ScrollProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ScrollProvider>
    </AuthProvider>
  );
}

export default App;
