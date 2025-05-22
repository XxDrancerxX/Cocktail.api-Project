import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";

export const SignIn = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("token_expiration");

    if (token && expiration && Date.now() > parseInt(expiration, 10)) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiration");
      setError("Your session has expired. Please sign in again.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please complete all fields");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        const expirationTime = Date.now() + 12 * 60 * 60 * 1000;
        localStorage.setItem("token_expiration", expirationTime);
        dispatch({ type: "SET_TOKEN", payload: data.token });
        dispatch({ type: "SET_USER", payload: data.user });
        navigate("/profile");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="neon-form d-flex flex-column align-items-center justify-content-center w-100"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #fce4ec, #e3f2fd)",
        fontFamily: "'Orbitron', sans-serif"
      }}
    >
      <div
        className="p-4 mb-3"
        style={{
          backgroundColor: "#1a1a1a",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          boxShadow: "0 0 25px rgba(255, 0, 255, 0.3)"
        }}
      >
        <h4
          className="text-center mb-4"
          style={{
            color: "#fff",
            textShadow: "0 0 8px #FF00FF, 0 0 16px #FF00FF",
            fontWeight: "bold"
          }}
        >
          Sign In
        </h4>

        {error && (
          <div className="alert alert-danger text-center p-2">{error}</div>
        )}

        <div className="mb-3">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-control"
            style={{
              background: "#000",
              color: "#FF00FF",
              border: "2px solid #FF00FF",
              boxShadow: "0 0 6px #FF00FF",
              borderRadius: "8px"
            }}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-control"
            style={{
              background: "#000",
              color: "#FF00FF",
              border: "2px solid #FF00FF",
              boxShadow: "0 0 6px #FF00FF",
              borderRadius: "8px"
            }}
          />
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{
            background: "#FF00FF",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            boxShadow: "0 0 12px #FF00FF, 0 0 24px #FF00FF",
            transition: "all 0.3s ease-in-out",
            borderRadius: "8px"
          }}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow =
              "0 0 16px #FF00FF, 0 0 32px #FF00FF, 0 0 48px #FF00FF")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow = "0 0 12px #FF00FF, 0 0 24px #FF00FF")
          }
        >
          Sign In
        </button>

        <div className="text-center mt-3">
          <Link
            to="/password"
            className="btn btn-link"
            style={{
              color: "#00eaff",
              textShadow: "0 0 10px #00eaff"
            }}
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </form>
  );
};
