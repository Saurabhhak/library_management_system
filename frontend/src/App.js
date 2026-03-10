import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Layout */
import HomeLayout from "./components/layout/HomeLayout";

/* Routing */
import PrivateRoute from "./components/routing/PrivateRoute";

/* Auth */
import AdminLoginForm from "./pages/auth/loginAdmin";

/* Dashboard */
import DisplayAdmin from "./pages/dashboard/DisplayAdmin";

/* Admin */
import CreateAdmin from "./pages/admin/CreateAdmin";
import UpdateAdmin from "./pages/admin/UpdateAdmin";

/* Pages */
import Home from "./pages/home/Home";
import History from "./pages/members/History";
import Members from "./pages/members/Members";
import Profile from "./pages/profile/Profile";

/* Books */
import Books from "./pages/books/Books";
import Category from "./pages/books/Category";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/login" element={<AdminLoginForm />} />

        {/* -------- PROTECTED ROUTES -------- */}
        <Route element={<PrivateRoute />}>
          <Route element={<HomeLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Home />} />

            {/* Admin Management */}
            <Route path="/createadmin" element={<CreateAdmin />} />
            <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
            <Route path="/displayadmin" element={<DisplayAdmin />} />

            {/* Members */}
            <Route path="/members" element={<Members />} />
            <Route path="/history" element={<History />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Books */}
            <Route path="/books" element={<Books />} />
            <Route path="/categories" element={<Category />} />
          </Route>
        </Route>

        {/* -------- If LSM routes does'nt matches to url route then 404 PAGE -------- */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
