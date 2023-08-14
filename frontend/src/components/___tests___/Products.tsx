import { NavLink, Outlet } from "react-router-dom";

export const Products = () => {
  return (
    <>
      <div>
        <input type="search" placeholder="Search products" />
      </div>
      <nav>
        <NavLink to={"featured"}>Featured</NavLink>
        <NavLink to={"new"}>New</NavLink>
      </nav>
      <Outlet />
    </>
  );
};
