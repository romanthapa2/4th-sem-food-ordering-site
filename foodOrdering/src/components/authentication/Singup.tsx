import "./Login.css";

type SignupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Singup = ({ isOpen, onClose }: SignupProps) => {
  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add sign up logic or API call here later
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
          <label className="login-label">
            Full Name
            <input
              className="login-input"
              type="text"
              placeholder="Your name"
              required
            />
          </label>

          <label className="login-label">
            Email
            <input
              className="login-input"
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              placeholder="Create a password"
              required
            />
          </label>

          <button className="login-submit" type="submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

