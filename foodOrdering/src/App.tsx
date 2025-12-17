import "./App.css";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/hero/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Contact } from "./components/Contact";
import { AboutUs } from "./components/AboutUs";
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
        </Routes>
      </BrowserRouter>

      <Contact/>

      <Footer />
    </>
  );
}

export default App;
