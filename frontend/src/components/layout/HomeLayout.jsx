import { Outlet } from "react-router-dom";
import NavbarSection from "./Navbar";
function HomeLayout() {
  return (
    <>
      <NavbarSection />
      <Outlet />
    </>
  );
}

export default HomeLayout;
