import "./App.css";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/hero/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { AboutUs } from "./components/AboutUs";
import { Products } from "./components/products/Products";
import { Cart } from "./components/cart/Cart";
import { Checkout } from "./components/checkout/Checkout";
// app file is the main component for a website so we need to make a page
// what it should look like in while openning the website.
// router setup and

function App() {
  return (
    <>


      <BrowserRouter>
            <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>

      <Footer />
    </>
  );
}

export default App;
