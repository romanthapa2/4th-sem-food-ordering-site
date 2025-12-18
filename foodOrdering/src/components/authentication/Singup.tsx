import { useState } from "react";
import "./Login.css";

type SignupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Singup = ({ isOpen, onClose }: SignupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      setSuccess(true);
      // Reset form
      setFormData({ name: "", email: "", password: "" });
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-backdrop" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button className="login-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="login-title">Create Account</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: "#e74c3c", fontSize: "14px", marginBottom: "10px" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ color: "#27ae60", fontSize: "14px", marginBottom: "10px" }}>
              Signup successful! Redirecting...
            </div>
          )}

          <label className="login-label">
            Full Name
            <input
              className="login-input"
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <label className="login-label">
            Email
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

