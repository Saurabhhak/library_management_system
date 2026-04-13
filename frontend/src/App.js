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
import CreateBook from "./pages/library/books/CreateBook";
import UpdateBook from "./pages/library/books/UpdateBook";
import BookInventory from "./pages/library/books/BookInventory";
import Bookslib from "./pages/library/books/Bookslib";

/* books essue */
import IssueBook from "./pages/library/IssueBook";

/* Books Category */
import CategoryPage from "./pages/library/Category/CategoryPage";
import AddCategory from "./pages/library/Category/AddCategory";
import CategoryInventory from "./pages/library/Category/CategoryInventory";
import UpdateCategory from "./pages/library/Category/UpdateCategory";

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

        {/* -------- PROTECTED ROUTES -------- */}
        <Route element={<PrivateRoute />}>
          {/* All authenticated admins */}
          <Route element={<HomeLayout />}>
            {/* Admin management */}
            {/* TEMP PUBLIC */}
            {/* <Route path="/createadmin" element={<CreateAdmin />} />
          <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
          <Route path="/displayadmin" element={<DisplayAdmin />} /> */}

            <Route
              path="/createadmin"
              element={
                <SuperAdminRoute>
                  <CreateAdmin />
                </SuperAdminRoute>
              }
            />
            <Route
              path="/updateadmin/:id"
              element={
                <SuperAdminRoute>
                  <UpdateAdmin />
                </SuperAdminRoute>
              }
            />
            <Route
              path="/displayadmin"
              element={
                <SuperAdminRoute>
                  <DisplayAdmin />
                </SuperAdminRoute>
              }
            />

            {/* Dashboard */}
            <Route path="/" element={<Home />} />
            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Charts */}
            <Route path="/chart" element={<Chart />} />
            <Route path="/adminchart" element={<AdminChart />} />
            <Route path="/adminpage" element={<AdminPage />} />
            <Route path="/categorypage" element={<CategoryPage />} />

            {/* Books */}
            <Route path="/createbook" element={<CreateBook />} />
            <Route path="/updatebook/:id" element={<UpdateBook />} />
            <Route path="/bookinventory" element={<BookInventory />} />
            <Route path="/issuebook" element={<IssueBook />} />
            <Route path="/bookslib" element={<Bookslib />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/categoryinventory" element={<CategoryInventory />} />
            <Route path="/updatecategory/:id" element={<UpdateCategory />} />

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
