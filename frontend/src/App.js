import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* ── Auth ── */
import { AuthProvider } from "./context/AuthContext";

/* ── Scroll System ── */
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
import MemberRoute from "./routes/MemberRoute";
import LandingRoute from "./routes/Landingroute";

/* ── Landing ── */
import Landing from "./pages/home/Landing";

/* ── Auth Pages — ONE set for everyone ── */
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import RegisterMember from "./pages/members/RegisterMember";

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
// import UpdateMember from "./pages/members/UpdateMember";

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

function AppShell() {
  const location = useLocation();
  const hideFooterOn = ["/"];
  const showFooter = !hideFooterOn.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />
      <NavbarSection />

      <Routes>
        {/* ── Landing ── */}
        <Route element={<LandingRoute />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* ── Public auth routes — ONE set, shared ── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<RegisterMember />} />
        </Route>

        {/* ── Protected — any authenticated role ── */}
        <Route element={<PrivateRoute />}>
          <Route element={<HomeLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/library" element={<BooksLib />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/history" element={<History />} />

            <Route
              path="/bookslib"
              element={<Navigate to="/library" replace />}
            />
            <Route
              path="/hightRatingBooks"
              element={<Navigate to="/library?filter=trending" replace />}
            />

            {/* ── Member-only ── */}
            <Route element={<MemberRoute />}>
              <Route path="/member/dashboard" element={<MemberDashboard />} />
            </Route>

            {/* ── Admin + SuperAdmin ── */}
            <Route element={<AdminRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/admin" element={<AdminDashboard />} />
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
              {/* <Route path="/updatemember/:id" element={<UpdateMember />} /> */}
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

      {showFooter && <Footer />}
    </>
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
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";

// /* ── Auth ── */
// import { AuthProvider } from "./context/AuthContext";

// /* ── Scroll System ── */
// import { ScrollProvider } from "./components/layout/ScrollContext";
// import ScrollToTop from "./components/layout/ScrollTotop";
// import ScrollToTopButton from "./components/layout/Scrolltotopbutton";

// /* ── Layouts ── */
// import HomeLayout from "./components/layout/HomeLayout";
// import NavbarSection from "./components/layout/Navbar";

// /* ── Route Guards ── */
// import PrivateRoute from "./routes/PrivateRoute";
// import PublicRoute from "./routes/PublicRoute";
// import AdminRoute from "./routes/AdminRoute";
// import SuperAdminRoute from "./routes/SuperAdminRoute";
// import MemberRoute from "./routes/MemberRoute";
// import LandingRoute from "./routes/Landingroute";

// /* ── Landing ── */
// import Landing from "./pages/home/Landing";

// /* ── Auth Pages — UNIFIED (admin + member) ── */
// import AdminLoginForm from "./pages/auth/AdminLogin";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import ResetPassword from "./pages/auth/ResetPassword";
// import MemberLogin from "./pages/members/auth/MemberLogin";
// import RegisterMember from "./pages/members/RegisterMember";

// /* ── Dashboards — role-specific landing pages ── */
// import AdminDashboard from "./components/dashboard/AdminDashboard";
// import MemberDashboard from "./components/dashboard/MemberDashboard";

// /* ── Inventories ── */
// import MemberInventory from "./pages/inventories/MemberInventory";
// import AdminInventory from "./pages/inventories/AdminInventory";
// import BookInventory from "./pages/inventories/BookInventory";
// import CategoryInventory from "./pages/inventories/CategoryInventory";
// import FeedbackInventory from "./pages/inventories/FeedbackInventory";
// import ContactInventory from "./pages/inventories/ContactInventory";

// /* ── Admin ── */
// import CreateAdmin from "./pages/admin/CreateAdmin";
// import UpdateAdmin from "./pages/admin/UpdateAdmin";

// /* ── Analytics ── */
// import AdminPage from "./pages/analytics/admin/AdminPage";
// import BookChartPage from "./pages/analytics/book/BookChartPage";
// import CategoryPage from "./pages/analytics/categories/CategoryPage";
// import MemberPage from "./pages/analytics/members/MemberPage";

// /* ── Core Pages ── */
// import Profile from "./pages/profile/Profile";
// import Settings from "./settings/Settings";
// import Home from "./pages/home/Home";

// /* ── Books ── */
// import CreateBook from "./pages/library/books/CreateBook";
// import UpdateBook from "./pages/library/books/UpdateBook";

// /* ── Transactions ── */
// import IssueBook from "./pages/library/transactions/IssueBook";

// /* ── Categories ── */
// import UpdateCategory from "./pages/library/categories/UpdateCategory";
// import AddCategory from "./pages/library/categories/AddCategory";

// /* ── History ── */
// import History from "./pages/history/History";

// /* ── Members ── */
// import UpdateMember from "./pages/members/UpdateMember";

// /* ── Library ── */
// import BooksLib from "./pages/library/library/Bookslib";
// import Authors from "./pages/library/library/Authors";

// /* ── Resources & Legal ── */
// import Documentation from "./pages/resources/Documentation";
// import ApiReference from "./pages/resources/ApiReference";
// import Changelog from "./pages/resources/Changelog";
// import HelpCenter from "./pages/resources/HelpCenter";
// import StatusPage from "./pages/resources/StatusPage";
// import Privacy from "./pages/home/Privacy";
// import Terms from "./pages/home/Terms";
// import Cookies from "./pages/home/Cookies";
// import Footer from "./pages/home/Footer";
// import FeedbackPage from "./pages/resources/FeedbackPage";
// import ContactUs from "./pages/resources/ContactUs";

// /* ── 404 ── */
// import NotFound from "./pages/errors/NotFound";

// function AppShell() {
//   const location = useLocation();
//   const hideFooterOn = ["/"];
//   const showFooter = !hideFooterOn.includes(location.pathname);

//   return (
//     <>
//       <ScrollToTop />
//       <ScrollToTopButton />
//       <NavbarSection />

//       <Routes>
//         {/* ── Landing ── */}
//         <Route element={<LandingRoute />}>
//           <Route path="/" element={<Landing />} />
//         </Route>

//         {/* ── Public auth routes ── */}
//         <Route element={<PublicRoute />}>
//           <Route path="/login" element={<AdminLoginForm />} />
//           <Route
//             path="/admin/forgot-password"
//             element={<ForgotPassword role="admin" />}
//           />

//           <Route path="/memberlogin" element={<MemberLogin />} />
//           <Route path="/register" element={<RegisterMember />} />
//           <Route
//             path="/member/forgot-password"
//             element={<ForgotPassword role="member" />}
//           />

//           <Route path="/admin/reset-password" element={<ResetPassword />} />
//           <Route path="/member/reset-password" element={<ResetPassword />} />
//         </Route>

//         {/* ── Protected — any authenticated role ── */}
//         <Route element={<PrivateRoute />}>
//           <Route element={<HomeLayout />}>
//             {/* Generic pages any logged-in role can reach */}
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/library" element={<BooksLib />} />
//             <Route path="/authors" element={<Authors />} />
//             <Route path="/history" element={<History />} />

//             <Route
//               path="/bookslib"
//               element={<Navigate to="/library" replace />}
//             />
//             <Route
//               path="/hightRatingBooks"
//               element={<Navigate to="/library?filter=trending" replace />}
//             />

//             {/* ── Member-only dashboard ── */}
//             <Route element={<MemberRoute />}>
//               <Route path="/member/dashboard" element={<MemberDashboard />} />
//             </Route>

//             {/* ── Admin + SuperAdmin ── */}
//             <Route element={<AdminRoute />}>
//               <Route path="/home" element={<Home />} />
//               <Route path="/admin" element={<AdminDashboard />} />
//               <Route path="/bookinventory" element={<BookInventory />} />
//               <Route path="/createbook" element={<CreateBook />} />
//               <Route path="/updatebook/:id" element={<UpdateBook />} />
//               <Route path="/bookchartpage" element={<BookChartPage />} />
//               <Route
//                 path="/categoryinventory"
//                 element={<CategoryInventory />}
//               />
//               <Route path="/addcategory" element={<AddCategory />} />
//               <Route path="/updatecategory/:id" element={<UpdateCategory />} />
//               <Route path="/categorypage" element={<CategoryPage />} />
//               <Route path="/memberinventory" element={<MemberInventory />} />
//               <Route path="/updatemember/:id" element={<UpdateMember />} />
//               <Route path="/memberpage" element={<MemberPage />} />
//               <Route path="/issuebook" element={<IssueBook />} />
//               <Route
//                 path="/feedbackinventory"
//                 element={<FeedbackInventory />}
//               />
//               <Route path="/feedback-page" element={<FeedbackPage />} />
//               <Route path="/docs" element={<Documentation />} />
//               <Route path="/api-reference" element={<ApiReference />} />
//               <Route path="/changelog" element={<Changelog />} />
//               <Route path="/help" element={<HelpCenter />} />
//               <Route path="/status" element={<StatusPage />} />
//               <Route path="/contact-us" element={<ContactUs />} />
//               <Route path="/contact-inventory" element={<ContactInventory />} />
//               <Route path="/privacy" element={<Privacy />} />
//               <Route path="/terms" element={<Terms />} />
//               <Route path="/cookies" element={<Cookies />} />
//             </Route>

//             {/* ── SuperAdmin only ── */}
//             <Route element={<SuperAdminRoute />}>
//               <Route path="/createadmin" element={<CreateAdmin />} />
//               <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
//               <Route path="/admininventory" element={<AdminInventory />} />
//               <Route path="/adminpage" element={<AdminPage />} />
//             </Route>

//             <Route path="*" element={<NotFound />} />
//           </Route>
//         </Route>

//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       {showFooter && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <ScrollProvider>
//         <BrowserRouter>
//           <AppShell />
//         </BrowserRouter>
//       </ScrollProvider>
//     </AuthProvider>
//   );
// }

// export default App;
