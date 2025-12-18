import "./Login.css";

type LoginProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
};

export const Login = ({ isOpen, onClose, onOpenSignup }: LoginProps) => {
  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you can later add real authentication logic or API call
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
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              required
            />
          </label>

          <button className="login-submit" type="submit">
            Continue
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


