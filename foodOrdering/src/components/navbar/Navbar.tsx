// Navbar.tsx
import { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Login } from "../authentication/Login";
import { Singup } from "../authentication/Singup";
import useCategory from "../../zustard/useProduct";

export const Navbar = () => {
  const {updateCategory} = useCategory();
  const [open, setOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (newCategory:string) => {
    setOpen(false); // Close dropdown
    navigate(`/products`);
    updateCategory(newCategory);
  };

  return (
    <>
      <div id="traditionally">Traditionally HomeMade</div>

      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-left">
            <li>
              <a onClick={() => navigate("/")}>Food Ordering App</a>
            </li>

            {/* SHOP ALL DROPDOWN */}
            <li className="dropdown-trigger" onClick={() => setOpen(!open)}>
              Shop All
              {open && (
                <ul className="dropdown">
                  <li onClick={() => handleCategoryClick('Momo')}>
                    Momo
                  </li>
                  <li onClick={() => handleCategoryClick('Khaja')}>
                    Khaja
                  </li>
                  <li onClick={() => handleCategoryClick('Pasta')}>
                    Pasta
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a onClick={() => navigate("/about-us")}>About Us</a>
            </li>
            <li>Contact Us</li>
          </ul>

          <ul className="nav-right">
            <li onClick={() => setIsLoginOpen(true)}>Sign In</li>
            <li onClick={() => navigate("/cart")}>Your Cart</li>
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