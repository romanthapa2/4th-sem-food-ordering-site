import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-col">
          <h2 className="footer-logo">dai ko pasal</h2>
          <p className="footer-desc">
            Traditionally homemade Nepali Foods delivered fresh and tasty.
          </p>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Shop All</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Business Info */}
        <div className="footer-col">
          <h3>Information</h3>
          <ul>
            <li>Shipping</li>
            <li>Return Policy</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div className="footer-col">
          <h3>Contact</h3>
          <p>Email: support@foodhub.com</p>
          <p>Phone: +977 9812345678</p>

          <div className="footer-socials">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} dai ko pasal · All Rights Reserved
      </div>
    </footer>
  );
};
