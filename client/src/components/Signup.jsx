import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

function Signup({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
    const response = await fetch(
  "https://projectbuilder-production-fc85.up.railway.app/api/users/signup",
  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
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
          <UserPlus size={48} color="var(--primary-color)" />
          <h2 style={{ marginTop: "1rem" }}>Create Account</h2>
          <p>Join to start building AI projects</p>
        </div>

        {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleSignup}>
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
            Sign Up
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary-color)" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
