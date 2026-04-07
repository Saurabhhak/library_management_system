import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Layout */
import HomeLayout from "./components/layout/HomeLayout";

/* ------- Invite Flow --------*/
import AcceptInvite from "./pages/auth/AcceptInvite";
import GoogleSuccess from "./pages/auth/GoogleSuccess";
import CompleteProfile from "./pages/profile/CompleteProfile";
import AdminLoginForm from "./pages/auth/AdminLogin";

/* Forgot Password*/
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import ResetPassword from "./pages/members/ResetPassword";

/* Dashboard */
import DisplayMember from "./pages/dashboard/DisplayMember";
import DisplayAdmin from "./pages/dashboard/DisplayAdmin";

/* Admin */
import CreateAdmin from "./pages/admin/CreateAdmin";
import UpdateAdmin from "./pages/admin/UpdateAdmin";

/* Chart  */
import Chart from "./components/Chart";

/* Pages */
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

/*  book */
import CreateBook from "./pages/books/book/CreateBook";
import UpdateBook from "./pages/books/book/UpdateBook";

/* Books */
import Books from "./pages/books/BooksLayout";
import BookInventory from "./pages/books/BookInventory";
import IssueBook from "./pages/books/IssueBook";
import Bookslib from "./pages/books/Bookslib";
import Category from "./pages/books/Category";
import CategoryInventory from "./pages/books/CategoryInventory";

/* History */
import History from "./pages/history/History";

/* Member */
import CreateMember from "./pages/members/CreateMember";
import UpdateMember from "./pages/members/UpdateMember";

/*  ------SuperAdmin Protected Route ------ */
// import SuperAdminRoute from "./routes/SuperAdminRoute";
/* -----  AdminChart  ----- */
import AdminChart from "./components/charts/AdminChart";
import AdminPage from "./pages/dashboard/AdminPage";

/* -----  Member Chart ----- */
import MemberPage from "./pages/members/MemberPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route
          path="/login"
          element={
            <AdminLoginForm
              handleGoogleLogin={() => {
                // SuperAdmin Google login — no invite token needed
                window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/superadmin`;
              }}
            />
          }
        />
        {/* Password Recovery Routes (PUBLIC) */}
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route
          path="/createadmin"
          element={
            // <SuperAdminRoute>
            <CreateAdmin />
          }
        />
        <Route element={<HomeLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<Home />} />
          {/* Admin Management */}
          <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
          <Route path="/displayadmin" element={<DisplayAdmin />} />
          {/* chart */}
          <Route path="/chart" element={<Chart />} />
          <Route path="/adminchart" element={<AdminChart />} />
          <Route path="/adminpage" element={<AdminPage />} />
          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          <Route path="/createbook" element={<CreateBook />} />
          <Route path="/updatebook/:id" element={<UpdateBook />} />
          {/* Books */}
          <Route path="bookinventory" element={<BookInventory />}></Route>
          <Route element={<Books />} />
          <Route path="issuebook" element={<IssueBook />} />
          <Route path="/bookslib" element={<Bookslib />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/categoryinventory" element={<CategoryInventory />} />
          {/* History */}
          <Route path="/history" element={<History />} />
          {/* Members */}
          <Route path="/createmember" element={<CreateMember />} />
          <Route path="/updatemember/:id" element={<UpdateMember />} />
          <Route path="/displaymember" element={<DisplayMember />} />
          {/* Member Chart */}
          <Route path="/memberpage" element={<MemberPage />} />
        </Route>
        {/* Invite Flow */}
        <Route path="/accept-invite/:token" element={<AcceptInvite />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
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
