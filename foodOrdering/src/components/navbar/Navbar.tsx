import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Login } from "../authentication/Login";
import { Singup } from "../authentication/Singup";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <div id="traditionally">Tradinally HomeMade</div>

      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-left">
            <li>
              <Link to="/">Food Ordering App</Link>
            </li>

            {/* SHOP ALL DROPDOWN */}
            <li className="dropdown-trigger" onClick={() => setOpen(!open)}>
              Shop All
              {open && (
                <ul className="dropdown">
                  <li>
                    <Link to="/momo">Momo</Link>
                  </li>
                  <li>
                    <Link to="/khaja">Khaja</Link>
                  </li>
                  <li>
                    <Link to="/pasta">Pasta</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>Contact Us</li>
          </ul>

          <ul className="nav-right">
            <li>Wishlist</li>
            <li onClick={() => setIsLoginOpen(true)}>Sign In</li>
            <li>Your Cart</li>
          </ul>
        </div>
      </nav>

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignup={() => setIsSignupOpen(true)}
      />
      <Singup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
};
