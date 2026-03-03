import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./HomeLayout";
import Home from "./Home";
import History from "./History";
import Members from "./Members";
import Profile from "./Profile";
import AdminLoginForm from "./AdminLog";
import AdminSignForm from "./AdminSign";
// import BooksMng from "./BooksMng";
import AdminManagment from "./AdminManagment";
import CreateAdmin from "./CreateAdmin";
import DisplayAdmin from "./DisplayAdmin";
import UpdateAdmin from "./UpdateAdmin";
import DeleteAdmin from "./DeleteAdmin";
import SearchAdmin from "./SearchAdmin";
import PrivateRoute from "./PrivateRoute";
import Category from "./Books/Category";
import BooksLib from "./Books/BooksLib";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Protected Routes  */}
          <Route element={<PrivateRoute />}>
            <Route element={<HomeLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/createadmin" element={<CreateAdmin />} />
              <Route path="/displayadmin" element={<DisplayAdmin />} />
              <Route path="/deleteadmin" element={<DeleteAdmin />} />
              <Route path="/updateadmin" element={<UpdateAdmin />} />
              <Route path="/searchadmin" element={<SearchAdmin />} />
              <Route path="/adminmanagment" element={<AdminManagment />} />
              {/* <Route path="/booksmng" element={<BooksMng />} /> */}
              <Route path="/history" element={<History />} />
              <Route path="/members" element={<Members />} />
              <Route path="/profile" element={<Profile />} />
              {/* Books or Category */}
              <Route path="/books" element={<BooksLib/>} />
              <Route path="/categories" element={<Category/>} />
            </Route>
          </Route>
          {/* Public Routes */}
          <Route path="/login" element={<AdminLoginForm />} />
          <Route path="/signup" element={<AdminSignForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
