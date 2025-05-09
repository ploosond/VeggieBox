import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { useAppContext } from "./context/AppContext";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();
  return (
    <div>
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div
        className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
