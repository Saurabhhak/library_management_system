import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ___ Layouts _____________________________________________________*/
import HomeLayout from "./components/layout/HomeLayout";

/* ___ Route guards ______________________________________________*/
import PrivateRoute from "./routes/PrivateRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import PublicRoute from "./routes/PublicRoute";

/* ___ Auth (ALL PUBLIC) ________________________________________*/
import AdminLoginForm from "./pages/auth/AdminLogin";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

/* ___ Dashboard _______________________________________________*/
import MemberInventory from "./pages/inventories/MemberInventory";
import AdminInventory from "./pages/inventories/AdminInventory";
import BookInventory from "./pages/inventories/BookInventory";
import CategoryInventory from "./pages/inventories/CategoryInventory";

/* ___ Admin _________________________________________________*/
import CreateAdmin from "./pages/admin/CreateAdmin";
import UpdateAdmin from "./pages/admin/UpdateAdmin";

/* ___ Charts Page _______________________________________________*/
import AdminPage from "./pages/analytics/admin/AdminPage";
import BookChartPage from "./pages/analytics/book/BookChartPage";
import CategoryPage from "./pages/analytics/categories/CategoryPage";
import MemberPage from "./pages/analytics/members/MemberPage";

/* ___ Pages ______________________________________________*/
import Profile from "./pages/profile/Profile";

/* ___ Home ______________________________________________*/
import Home from "./pages/home/Home";

/* ___ Books ____________________________________________*/
import CreateBook from "./pages/library/books/CreateBook";
import UpdateBook from "./pages/library/books/UpdateBook";
import Bookslib from "./pages/library/library/Bookslib";

/* ___ books essue ____________________________________*/
import IssueBook from "./pages/library/transactions/IssueBook";

/* ___ Books Category _______________________________*/
import UpdateCategory from "./pages/library/categories/UpdateCategory";
import AddCategory from "./pages/library/categories/AddCategory";

/* ___ History ____________________________________*/
import History from "./pages/history/History";

/* ___ Members __________________________________*/
import CreateMember from "./pages/members/CreateMember";
import UpdateMember from "./pages/members/UpdateMember";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ___________ PUBLIC ROUTES ___________ */}
        {/* ___________ PUBLIC ROUTES (BUT PROTECTED AFTER LOGIN) ___________ */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AdminLoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ___________ PROTECTED ROUTES ___________ */}
        <Route element={<PrivateRoute />}>
          {/* All authenticated admins */}
          <Route element={<HomeLayout />}>
            {/* Admin management */}
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
            {/* _____________ INVENTORIES _________ */}
            <Route
              path="/admininventory"
              element={
                <SuperAdminRoute>
                  <AdminInventory />
                </SuperAdminRoute>
              }
            />
            <Route path="/categoryinventory" element={<CategoryInventory />} />
            <Route path="/memberinventory" element={<MemberInventory />} />
            <Route path="/bookinventory" element={<BookInventory />} />

            {/* _____________ Dashboard ______________*/}
            <Route path="/" element={<Home />} />

            {/* _____________ Profile ______________*/}
            <Route path="/profile" element={<Profile />} />

            {/* _____________ Charts Page ______________*/}
            <Route path="/categorypage" element={<CategoryPage />} />
            <Route path="/adminpage" element={<AdminPage />} />
            <Route path="/bookchartpage" element={<BookChartPage />} />
            <Route path="/memberpage" element={<MemberPage />} />

            {/* _____________ Books ______________*/}
            <Route path="/updatecategory/:id" element={<UpdateCategory />} />
            <Route path="/addcategory" element={<AddCategory />} />
            {/* ____________ Category ___________ */}
            <Route path="/updatebook/:id" element={<UpdateBook />} />
            <Route path="/createbook" element={<CreateBook />} />

            {/* _____ Books Essue And Return ______ */}
            <Route path="/issuebook" element={<IssueBook />} />

            {/* ____________ Library ____________ */}
            <Route path="/bookslib" element={<Bookslib />} />

            {/* _____________ History ______________*/}
            <Route path="/history" element={<History />} />

            {/* _____________ Members ______________*/}
            <Route path="/updatemember/:id" element={<UpdateMember />} />
            <Route path="/createmember" element={<CreateMember />} />
          </Route>
        </Route>
        {/* ___________ If LSM routes does'nt matches to url route then 404 PAGE ___________ */}
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
