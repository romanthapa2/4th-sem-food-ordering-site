import React, { useState } from "react";
import "./Login.css";

type LoginProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
};

export const Login = ({ isOpen, onClose, onOpenSignup }: LoginProps) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend sends { message: '...' } on error
        setError(data?.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Login successful
      console.log("Login successful:", data);

      setIsLoading(false);
      // You can store user data/token here if needed
      // e.g., localStorage.setItem("user", JSON.stringify(data.user));

      onClose();
    } catch (err) {
      console.error("Login request error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-backdrop" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(event) => {
          // Prevent closing when clicking inside the modal content
          event.stopPropagation();
        }}
      >
        <button className="login-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="login-title">Sign In</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Email
            <input
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit">
            {isLoading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="login-helper">
          Don&apos;t have an account?{" "}
          <span
            className="login-link"
            onClick={() => {
              onClose();
              onOpenSignup();
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};


