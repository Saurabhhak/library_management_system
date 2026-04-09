import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Layout */
import HomeLayout from "./components/layout/HomeLayout";

/* Route guards */
import PrivateRoute from "./routes/PrivateRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";

/* Auth (ALL PUBLIC) */
import AdminLoginForm from "./pages/auth/AdminLogin";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
import Books from "./pages/books/BooksLayout";
import CreateBook from "./pages/books/book/CreateBook";
import UpdateBook from "./pages/books/book/UpdateBook";
import BookInventory from "./pages/books/BookInventory";
import Bookslib from "./pages/books/Bookslib";
import Category from "./pages/books/Category";
import CategoryInventory from "./pages/books/CategoryInventory";
import IssueBook from "./pages/books/IssueBook";

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
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/login" element={<AdminLoginForm />} />
        {/* Password Recovery Routes (PUBLIC) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
            {/* Admin management temprary public*/}
        <Route
          path="/createadmin"
          element={
            // <SuperAdminRoute>
              <CreateAdmin />
            // </SuperAdminRoute>
          }
        />
        <Route
          path="/updateadmin/:id"
          element={
            // <SuperAdminRoute>
              <UpdateAdmin />
            // </SuperAdminRoute>
          }
        />
        <Route
          path="/displayadmin"
          element={
            // <SuperAdminRoute>
              <DisplayAdmin />
            // </SuperAdminRoute>
          }
        />
        {/* -------- PROTECTED ROUTES -------- */}
        <Route element={<PrivateRoute />}>
          {/* All authenticated admins */}
          <Route element={<HomeLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Home />} />

            {/* Admin management */}
            {/* ......... */}

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
        {/* -------- If LSM routes does'nt matches to url route then 404 PAGE -------- */}
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
              {/* Example Icon using a Unicode emoji or an SVG component */}
              <span style={{ fontSize: "4rem" }}>
                <i className="fa-solid fa-face-sad-tear"></i>
              </span>
              <h1 style={{ margin: 0 }}>404 Page Not Found</h1>
              <p>Oops! The page you are looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
