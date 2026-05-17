import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box animate-slide-up">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <LogIn size={48} color="var(--primary-color)" />
          <h2 style={{ marginTop: "1rem" }}>Welcome Back</h2>
          <p>Login to continue building projects</p>
        </div>

        {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--primary-color)" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
