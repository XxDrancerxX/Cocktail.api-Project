import React, { useState } from "react";

export const Password = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/password-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
      } else {
        setSuccess(data.msg || "Check your email for a reset link.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #fce4ec, #e3f2fd)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Orbitron', sans-serif",
        padding: "30px",
      }}
    >
      <form
        className="neon-form p-4"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(255, 0, 255, 0.3)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h4
          className="text-center mb-4"
          style={{
            color: "#fff",
            textShadow: "0 0 6px #FF00FF, 0 0 12px #FF00FF",
            fontWeight: "bold",
          }}
        >
          Password Recovery
        </h4>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="form-control"
            style={{
              background: "#000",
              color: "#FF00FF",
              border: "2px solid #FF00FF",
              boxShadow: "0 0 6px #FF00FF",
              borderRadius: "8px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn"
            style={{
              background: "#FF00FF",
              color: "#fff",
              fontWeight: "bold",
              boxShadow: "0 0 12px #FF00FF, 0 0 24px #FF00FF",
              transition: "all 0.3s ease-in-out",
              borderRadius: "8px",
              padding: "10px 25px",
            }}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </div>

        {error && (
          <p className="text-danger mt-3 text-center">{error}</p>
        )}

        {success && (
          <p
            className="mt-3 text-center"
            style={{
              color: "#00eaff",
              textShadow: "0 0 6px #00eaff, 0 0 12px #00eaff",
              fontWeight: "500",
            }}
          >
            {success}
          </p>
        )}
      </form>
    </div>
  );
};
