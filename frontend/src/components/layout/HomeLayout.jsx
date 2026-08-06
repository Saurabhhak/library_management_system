import { Outlet } from "react-router-dom";

function HomeLayout() {
  return <Outlet />; // Navbar already globally AppShell me render ho raha hai
}

export default HomeLayout;