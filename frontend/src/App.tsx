import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/___tests___/Home";
// import { About } from "./pages/___tests___/About";
import { Navbar } from "./components/___tests___/Navbar";
import { OrderSummary } from "./components/___tests___/OrderSummary";
import { NoMatch } from "./components/___tests___/NoMatch";
import { Products } from "./components/___tests___/Products";
import { FeaturedProducts } from "./components/___tests___/FeaturedProducts";
import { NewProducts } from "./components/___tests___/NewProducts";
import { Users } from "./components/___tests___/Users";
import { UserDetails } from "./components/___tests___/UserDetails";
import { Admin } from "./components/___tests___/Admin";
import { Profile } from "./components/___tests___/Profile";

const LazyAbout = React.lazy(() => import("./pages/___tests___/About"));

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="about"
          element={
            <React.Suspense fallback="Loading...">
              <LazyAbout />
            </React.Suspense>
          }
        />
        <Route path="order-summary" element={<OrderSummary />} />
        <Route path="products" element={<Products />}>
          <Route index element={<FeaturedProducts />} />
          <Route path="featured" element={<FeaturedProducts />} />
          <Route path="new" element={<NewProducts />} />
        </Route>
        <Route path="user" element={<Users />}>
          <Route path=":userId" element={<UserDetails />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
