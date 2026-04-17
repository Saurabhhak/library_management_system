import { Outlet, Link } from "react-router-dom";

function BooksLayout() {
  return (
    <div>
      <h2>Books Management</h2>
      {/* Sub Nav */}
      <div>
        <Link to="/books/createbook">ADD Books</Link>
        <Link to="/books">Add Books</Link> |{" "}
        <Link to="/books/categories">Categories</Link>
      </div>

      <Outlet />
    </div>
  );
}

export default BooksLayout;
