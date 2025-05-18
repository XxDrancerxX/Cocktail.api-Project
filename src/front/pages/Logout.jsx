import React from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clean token
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiration");
    localStorage.removeItem("session_expired");

    // send you to login
    navigate("/signin");
  };

  return (
    <div className="logout-container text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", background: "linear-gradient(to right, #ffe0f1, #e0f7ff)", fontFamily: "'Orbitron', sans-serif" }}>
      <h2 className="mb-3" style={{ color: "#000", textShadow: "0 0 6px #FF00FF, 0 0 12px #FF00FF" }}>
        You have been logged out
      </h2>
      <p className="mb-4" style={{ color: "#444" }}>
        Click below to sign in again.
      </p>
      <button
        className="btn logout-button"
        onClick={handleLogout}
        style={{
          background: "#FF00FF",
          color: "#fff",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 0 12px #FF00FF, 0 0 24px #FF00FF",
          transition: "all 0.3s ease-in-out"
        }}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow =
            "0 0 16px #FF00FF, 0 0 32px #FF00FF, 0 0 48px #FF00FF")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 12px #FF00FF, 0 0 24px #FF00FF")
        }
      >
        Go to Sign In
      </button>
    </div>
  );
};
